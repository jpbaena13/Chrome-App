/**
 * Módulo para el manejo de la línea de tiempo
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.modules
 * @author      JpBaena13
 */
define(
	[
		WEBROOT_URL + 'js/modules/noteboard.js',
		WEBROOT_URL + 'js/core/sandbox.js'
	],
	function(noteboard, sandbox) {

		var $this = undefined;
		
		/**
		 * Función de inicio de módulo
		 */
		var _init = function(args) {
			$this = this;
			$this.sandbox = new sandbox($this);
			$this.elems = {};
			$this.position = 1;
			$this.ArrowsEnabled = false;
			$this.playing = false;

			$this.sandbox.on('resource-index-timeline', _indexTimeline);
			$this.sandbox.on('resource-loaded', _reorderAreas);
			$this.sandbox.on('window-keyup', _keyUp);

			$this.sandbox.on('noteboardTool-timeline', _activeTimeline);

			$this.left = undefined;
			$this.top = undefined;
			$this.height = undefined;
			$this.width = undefined;

			$this.elems.timeline = $('<div>', {id: 'timeline', Class: 'timeline'})
								.selectable({
									filter: '',
									cancel: '.untResource',
									start: function(evt) {
										$this.left =  (evt.pageX - noteboard.target.offset().left) / noteboard.scale;
										$this.top =  (evt.pageY - noteboard.target.offset().top) / noteboard.scale;
									},
									stop: function(evt) {
										var x = (evt.pageX - noteboard.target.offset().left) / noteboard.scale
											,y = (evt.pageY - noteboard.target.offset().top) / noteboard.scale;

										$this.width =  Math.abs($this.left - x);
										$this.height =  Math.abs($this.top - y);
										$this.left = Math.min(x, $this.left);
										$this.top = Math.min(y, $this.top);

										if ($this.width > 10 && $this.height > 10) //Evitando click
											_createArea();
									}
								})
								.disableSelection()
								.appendTo( noteboard.target );

			_timelinePanel();
			_inactiveTimeline();
			noteboard.showArea = _showArea;
			noteboard.inactiveTimeline = _inactiveTimeline;
		}

		/**
		 * Crea un area que permite definir un momento del timeline
		 */
		var _createArea = function() {
			var data = {};

			data.bg	= 'transp';
			data.fs	= 'frame';
			data.ff	= 'frame';
			data.msg = noteboard.areas.length + 1;
			data.h	= $this.height;
			data.l	= $this.left;
			data.t	= $this.top;
			data.w	= $this.width;

			noteboard.createResource(data);
		}

		/**
		 * Añade el botón de activación de la herramienta de timelie al panel de
		 * herramientas del noteboard.
		 */
		var _activeTimeline = function() {
			$this.elems.timeline.show();
			$this.elems.container.show();
			$this.elems.buttons.show();
			$this.sandbox.emit('timeline-show');
			$('#timelinePanel').data('jsp').reinitialise();
		}

		/**
		 * Desactiva el timeline ocultando los elementos correspondientes a este.
		 */
		var _inactiveTimeline = function() {
			$this.elems.timeline.hide();
			$this.elems.container.hide();
			$this.elems.buttons.hide();
			$this.sandbox.emit('timeline-hide');
		}

		/**
		 * Añade el panel de diapositivas del timeline
		 */
		var _timelinePanel = function() {
			$this.elems.container = $('<div>', {id: 'timelinePanel'})
										.appendTo( noteboard.target.parent() );

			$this.elems.timelinePanel = $('<ul>').appendTo( $this.elems.container )
										.sortable({
											stop: function(evt, ui) {
												var index = ui.item.index() + 1;
												var model = ui.item.data('model');

												if (model.data.msg != index) {
													model.setIndexTimeline( {'index': index} );
												}
											}
										})
										.disableSelection();

			$this.elems.container.jScrollPane({
	            showArrows: false,
	            maintainPosition: true,
	            stickToBottom: true,
	        });

			$this.elems.buttons = $('<div>',{ id: 'timelineButtons'}).appendTo( noteboard.target.parent() );

			$this.elems.posNumber = $('<input>', {Class: 'timelineNumber', type: 'text'})
									.appendTo( $this.elems.buttons )
									.val($this.position)
									.on('change', function(e, i){										
										var len = noteboard.areas.length
											,id = (this.value < 1) ? 1 : (this.value > len) ? len : this.value
											,timeline = noteboard.areas[id-1];										

										_showArea(timeline.model);

										$this.position = id;
										$this.elems.posNumber.val($this.position);
									});
			
			$this.elems.btnLeft = $('<div>',{ Class: 'icon-arrow-left untBtnZoom', title: i18n.backTime})
									.prependTo( $this.elems.buttons )
									.on('click', function(){
										$this.position--;

										var id = Math.max($this.position, 1)
											,timeline = noteboard.areas[id-1];										

										_showArea(timeline.model);

										$this.position = id;
										$this.elems.posNumber.val($this.position);
									})
									.qtip({
										position: { my: 'top right' }
									});

			$this.elems.btnRight = $('<div>', {Class: 'icon-arrow-right untBtnZoom', title: i18n.nextTime})
									.prependTo( $this.elems.buttons )
									.on('click', function(){
										$this.position++;

										var id = Math.min($this.position, noteboard.areas.length)
											,timeline = noteboard.areas[id-1];

										_showArea(timeline.model);

										$this.position = id;
										$this.elems.posNumber.val($this.position);	
									})
									.qtip({
										position: { my: 'top right' }
									});

			$this.elems.play = $('<div>', {Class: 'timelinePlay icon-play', title: i18n.playTimeline})
									.prependTo( $this.elems.buttons )
									.qtip({
										position: { my: 'top right' }
									})
									.on('click', function(){
										fullScreen();
										$this.elems.container.toggle( $this.playing );
										$this.elems.timeline.toggle( $this.playing );
										$this.ArrowsEnabled = !$this.playing;
										$this.elems.buttons.css('bottom', ($this.playing) ? '265px' : '30px');

										$('#previewer').toggle( $this.playing );

										if (!$this.playing) _showArea(noteboard.areas[0].model);
										$this.playing = !$this.playing;
									});
		}

		/**
		 * Permite posicionarse sobre el area especificada.
		 * 
		 * @param  TimelineArea area Objeto que representa el area sobre la cual posicionarse
		 */
		var _showArea = function(model) {
			var wWidth = window.innerWidth
				,wHeight = window.innerHeight - 50
				,wRation = wWidth/wHeight
				,ration = model.data.w/model.data.h;

			// Animation
			noteboard.target.css('transition', '1s linear')
						   .css('transition-property', 'left,top');

			if (ration > wRation) {
				noteboard.zoom( wWidth/model.data.w );
				var h = (wHeight - (model.data.h * noteboard.scale)) / 2;
				noteboard.target.offset({ left: -model.data.l * noteboard.scale, top: (-model.data.t * noteboard.scale) + 50 + h });
			} else {
				noteboard.zoom( wHeight/model.data.h );
				var w = (wWidth - (model.data.w * noteboard.scale)) / 2;
				noteboard.target.offset({ left: -(model.data.l * noteboard.scale) + w, top: (-model.data.t * noteboard.scale) + 50 });
			}

			$this.sandbox.emit('noteboard-drag');
			$this.elems.container.find('.selected').removeClass('selected');
			$this.elems.container.find('ul li:eq(' + (model.data.msg - 1) + ')').addClass('selected');
			$this.position = model.data.msg;

			setTimeout(function(){
				noteboard.target.css('transition', 'none');
			},1000)
		}

		/**
		 * Reorganiza el orden del timeline de acuerdo
		 * a los parámetros especificados
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { id, msg }
		 */
		var _indexTimeline = function(args) {
			if(args.realTime) {
				noteboard.getModel(args.id).setIndexTimeline(args);
			}				
		}

		/**
		 * Permite organizar los preview de las  áres por el valor
		 * correspondiente a cada una de ellas.
		 */
		var _reorderAreas = function() {
			var len = $('#timelinePanel ul li').length
				,elems = [];

			for (var i = 0; i < len; i++) {
				var elem = $('#timelinePanel ul li:eq(' + i + ')');
				elems[elem.attr('index') - 1] = elem;
			}

			elems.forEach(function(elem){
				elem.appendTo( $('#timelinePanel ul') );
			});

			if (elems[0]) elems[0].addClass('selected');
		}

		/**
		 * Permite alternar entre las diapositivas cuando las
		 * flechas left - right son presionadas. También captura
		 * 
		 * 
		 * @param  Event evt   Objeto del evento de keypress
		 * @param  int keyCode Número de la tecla presionada
		 */
		var _keyUp = function(evt, keyCode) {
			if (!$this.ArrowsEnabled) return;

			if (keyCode == 37) {
				$this.elems.btnLeft.click();

			} else if (keyCode == 39) {
				$this.elems.btnRight.click();

			} else if (keyCode == 27) {
				$this.elems.play.click();
			}
		}

		// Retornando la interfaz
		return {	
			init: _init
		}			
	}
)