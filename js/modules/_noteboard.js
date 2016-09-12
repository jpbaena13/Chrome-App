	/**
 * Módulo del noteboard
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.modules
 * @author      JpBaena13
 */

'use strict';

define(
	[
		WEBROOT_URL + 'js/core/sandbox.js'
	], 
	function(sandbox) {

		var $this = undefined

			// Exclusivo para selectable
			, _left
			, _top
			, _width
			, _height;

		/**
		 * Función de inicio de módulo
		 */
		var _init = function(args) {
			$this = this;
			$this.sandbox = new sandbox(this);
			$this.elems = {};
			$this.parentId = $this.target.data('parentid');
			$this.scale = 1;
			$this.auto_increment = 0;
			$this.user = args.noteboard.user;
			$this.permissions = args.noteboard.owner || args.noteboard.shared;
			$this.collaborators = args.noteboard.collaborators;
			$this.readyFunctions = [];

			$this.states = {
				POINTER: 	1,
				MOVE: 		2,
				ZOOM: 		3,
				PENCIL: 	4,
				ERASER: 	5,
				TIMELINE: 	6
			}

			$this.state = $this.states.POINTER;

			// --- Suscripción a eventos
			$this.sandbox.on('window-keydown', _keydown);
			$this.sandbox.on('window-keypress', _keypress);
			$this.sandbox.on('window-click', _click);
			$this.sandbox.on('noteboard-mousedown', _mousedown);
			$this.sandbox.on('noteboard-mouseup', _mouseup);
			$this.sandbox.on('noteboard-mousewheel', _mousewheel);

			$this.sandbox.on('preview-drag', _moveNoteboard);

			$this.sandbox.on('note-lock', _noteLockRT);
			$this.sandbox.on('note-unlock', _noteUnlockRT);

			// --- Eventos del noteboardTool
			$this.sandbox.on('noteboardTool-pointer', _eventsTool.pointer);
			$this.sandbox.on('noteboardTool-move', _eventsTool.move);
			$this.sandbox.on('noteboardTool-select', _eventsTool.select);
			$this.sandbox.on('noteboardTool-zoom', _eventsTool.zoom);
			$this.sandbox.on('noteboardTool-pencil', _eventsTool.pencil);
			$this.sandbox.on('noteboardTool-eraser', _eventsTool.eraser);
			$this.sandbox.on('noteboardTool-timeline', _eventsTool.timeline);

			//----------------------------
			//----   Eventos <window> ----
			//----------------------------
			$(window)
				.on('resize', function(e) {
					$this.sandbox.emit('window-resize', e);
				})

				.on('keydown', function(e) {
					var keyCode = e.keyCode || e.which;
					$this.sandbox.emit('window-keydown', e, keyCode);
					if (e.ctrlKey && (keyCode == 187 || keyCode == 189)) return false; // Deshabilitando zoom con teclado
				})

				.on('keyup', function(e) {
					var keyCode = e.keyCode || e.which;
					$this.sandbox.emit('window-keyup', e, keyCode);
				})

				.on('keypress', function(e) {
					var keyCode = e.keyCode || e.which;
					$this.sandbox.emit('window-keypress', e, keyCode);
				})

				.on('click', function(e){
					$this.sandbox.emit('window-click', e);
				})

				.on('scroll', function(e) {
					$this.sandbox.emit('window-scroll', e);
				});

			//Configurando eventos de <noteboard>
			$this.target
				.on('dblclick', function(e) {
		    		if ($this.state != $this.states.POINTER)
		    			return;

		    		var data = {
		    			l: (e.pageX - $this.target.offset().left) / $this.scale,
		    			t: (e.pageY - $this.target.offset().top) / $this.scale
		    		}

		    		$this.sandbox.emit('noteboard-dblclick', data );
		    	})

		    	.on('mousedown', function(e){
		    		$this.sandbox.emit('noteboard-mousedown', e)
		    	})

		    	.on('mouseup', function(e){
		    		$this.sandbox.emit('noteboard-mouseup', e)
		    	})

		    	.on('mousewheel', function(e){
		    		$this.sandbox.emit('noteboard-mousewheel', e)
		    	})

		    	.on('drop', function(e){
		    		e.preventDefault();  
    				e.stopPropagation();
		    		$this.sandbox.emit('noteboard-drop', e)
		    	})

		    	.on("dragover", function(e) {
				    e.preventDefault();
				    e.stopPropagation();
				})

				.on("dragleave", function(e) {
				    e.preventDefault();
				    e.stopPropagation();
				})

				.draggable({
					drag: function(event, ui) { $this.sandbox.emit('noteboard-drag', event, ui); },
					stop: function(event, ui) { $this.sandbox.emit('noteboard-drag', event, ui); },
					disabled: true
				})

				.selectable({
					distance: 1,
					filter: '',
					cancel: '.untResource',
					start: function(evt) {
						_left =  (evt.pageX - $this.target.offset().left) / $this.scale;
						_top =  (evt.pageY - $this.target.offset().top) / $this.scale;

						if (!evt.shiftKey)
							_unselectResources();
					}, 
					stop: function(evt) {
						var x = (evt.pageX - $this.target.offset().left) / $this.scale
							,y = (evt.pageY - $this.target.offset().top) / $this.scale;

						_width =  Math.abs(_left - x);
						_height =  Math.abs(_top - y);
						_left = Math.min(x, _left);
						_top = Math.min(y, _top);

						switch($this.state) {
							case $this.states.POINTER:
								_resourceSelectable(evt);
							break;

							case $this.states.ZOOM:
								_zoomSelectable();
							break;
						}						
					}
				});

			// Aplicando mousewheel al "untMainContent"
	    	$this.target.parent().on('mousewheel', function(e) {
	    		$this.sandbox.emit('noteboard-mousewheel', e)
	    	});

	    	//Instanciando barra de navegabilidad y herramientas
			if(args.noteboard.user.id != undefined) {
				$this.instance = new Noteboard(args.noteboard, true);
				_noteboardTools();
				_ZoomTools();
			}

			// Posicionando el tablero en el centro despues de cargar los módulos
			$this.ready(function(){
				var nWidth = $this.target.width()
					,nHeight = $this.target.height()
					,wWidth = window.innerWidth
					,wHeight = window.innerHeight
					,left = (nWidth - wWidth) / 2
					,top = (nHeight - wHeight) / 2;
					
				_moveNoteboard({left: left, top: top});
				$this.sandbox.emit('noteboard-drag');
			});
		}

		/**
		 * Construye el panel de herramientas del noteboard.
		 */
		var _noteboardTools = function() {
			$this.elems.container = $('<div>', {id: 'noteboardToolbar'}).appendTo( $('.untMainContent') );
			$this.elems.subcontainer = $('<div>', {Class: 'subcontainer'}).appendTo( $this.elems.container );

			$this.elems.pointer = $('<div>', {Class: 'button singleton pointer selected', title: i18n.pointerTool})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-pointer'); });


			$this.elems.move = $('<div>', {Class: 'button singleton move', title: i18n.moveTool})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-move'); });


			$this.elems.zoom = $('<div>', {Class: 'button singleton zoom', title: i18n.zoomTool})
					.appendTo(  $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-zoom'); });


			// Ocultar recursos sobre el tablero
			var hideResource = false;
			var _toggleHideResource = function() {
				if (hideResource) {
					$this.elems.hideResource.removeClass('hide-resource-off selected');
					$('.untResource').show();
				} else {
					$this.elems.hideResource.addClass('hide-resource-off selected');
					$('.untResource').hide();
				} 

				hideResource = !hideResource;
			}

			$this.elems.hideResource = $('<div>', {Class: 'button hide-resource-on', title: i18n.hideResourceTool})
					.appendTo(  $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', _toggleHideResource);

			
			$this.elems.subcontainer.append($('<div>',{Class: 'line'}));


			$this.elems.pencil = $('<div>', {Class: 'button singleton pencil', title: i18n.pencilTool})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-pencil'); });


			$this.elems.eraser = $('<div>', {Class: 'button singleton eraser', title: i18n.eraserTool})
					.appendTo( $this.elems.subcontainer ) 
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-eraser'); })
					.on('dblclick', function(){ $this.sandbox.emit('noteboardTool-eraser-dbclick')});



			// --- Panel de Colores
			var colorsPanel = $('<div>', {id: 'colors'}),
				colors = {  red: 	$('<div>', {Class: 'red'}),
							orange: $('<div>', {Class: 'orange'}),
							yellow: $('<div>', {Class: 'yellow'}),
							green: 	$('<div>', {Class: 'green'}),							
							blue: 	$('<div>', {Class: 'blue'}),							
							white: 	$('<div>', {Class: 'white'}),
							black: 	$('<div>', {Class: 'black'})
						}

			$.each(colors, function(key, elem){
				elem.appendTo( colorsPanel );
				elem.on('click', function(){ $this.sandbox.emit('noteboardTool-color-change', key); 
										 	 $this.sandbox.emit('noteboardTool-pencil');});
			});

			$this.elems.color = $('<div>', {Class: 'button color'})
					.appendTo( $this.elems.subcontainer )
					.qtip({ position: { my: 'bottom center', at: 'top center'},
							show: { event: 'click' },
							hide: { event: 'unfocus' },
							content: colorsPanel })
					.html('<div class="selected"></div>');


			$this.elems.subcontainer.append($('<div>',{Class: 'line'}));

			
			$this.elems.slides = $('<div>', {Class: 'button singleton slides', title: i18n.timelineTool})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){ $this.sandbox.emit('noteboardTool-timeline'); });



			// --- Pantalla Oculta
			$this.elems.Screen = $('<div>', {Class: 'untHideScreen'})
										.appendTo( $('body') )
										.draggable({ axis: "y" });

			var hideScreen = false;
			var _toggleScreen = function() {
				if (hideScreen) {
					$this.elems.Screen.hide();
					$(this).removeClass('selected');
				} else {
					$this.elems.Screen.show();
					$(this).addClass('selected');
				} 

				hideScreen = !hideScreen;
			}

			$this.elems.screenHide = $('<div>', {Class: 'button screen-hide', title: i18n.screenHide})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', _toggleScreen);


			$this.elems.subcontainer.append($('<div>',{Class: 'line'}));


			// --- Exportando Imagen
			$this.elems.export = $('<div>', {Class: 'button export', title: i18n.exportTool})
					.appendTo( $this.elems.subcontainer )
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.on('click', function(){  
												var iframe = $('<iframe>', {src: 'https://realtime.unnotes.com/Noteboard/ExportImage/' + $('#noteboard').data('url') + '/BaukdCsQnZvNUT6tzhhN2DPQAEv9dTc8Ppf5b9BPBhJG64XRQqNuP7ATR6r2bnKnUA4G3YgVfRr5Uqu2' }).css('display', 'none');
												iframe.appendTo( $('body') ).load(function() {
													var ifr = this.contentDocument || this.contentWindow.document
														, data = ifr.getElementsByTagName('pre')[0].innerHTML;
													
													data = $.parseJSON(data);
													validateData(data);
												});
											});

			// --- Panel de actividades
			var history = false;
			var _toggleHistory = function() {
				if (history) {
					$('#historyContainer').hide();
				
					$(this).removeClass('selected');
				} else {
					$('#historyContainer').show()
					$(this).addClass('selected');
				} 

				history = !history;
			}

			$this.elems.history = $('<div>', {Class: 'button history', title: i18n.historyTool})
					.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 1000 }})
					.appendTo( $this.elems.subcontainer )					
					.on('click', _toggleHistory);


			// Colaboradores
			$this.elems.subcontainer2 = $('<div>', {Class: 'subcontainer collaborators'}).appendTo( $this.elems.container );

			$('<div>', {Class: 'collaborator icon-plus', title: i18n.addCollaborators})
						.appendTo( $this.elems.subcontainer2 )
						.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 500 }})
						.on('click', function(){ $this.instance.view.elems.share.click(); });

			$this.collaborators.forEach(function(collaborator){
				$('<div>', {Class: 'collaborator', title: collaborator.fullname})
						.appendTo( $this.elems.subcontainer2 )
						.qtip({position: { my: 'bottom center', at: 'top center'}, show: { delay: 500 }})
						.css('background-image', 'url(' + collaborator.profileImage + ')')
						.draggable({ revert: true, helper: "clone" })
			});
		}

		/**
		 * Crea los botones y herramientas para la herramienta de zoom.
		 * Incluye el botón para usar pantalla completa.
		 */
		var _ZoomTools = function() {
			$this.elems.zoomPanel = $('<div>', {id: 'zoomToolbar'}).appendTo( $this.target.parent() );

			$this.elems.btnZoomin = $('<div>', {Class: 'untBtnZoom icon-plus', title: i18n.zoomIn})
										.appendTo( $this.elems.zoomPanel )
										.on('click', function(e){
											e.originalEvent.deltaY = -1
											$this.sandbox.emit('noteboard-mousewheel', e, 0.2);
										})
										.qtip({
											position: { my: 'top right' }
										});

			$this.elems.btnZoomout = $('<div>', {Class: 'untBtnZoom icon-minus', title: i18n.zoomOut})
										.appendTo( $this.elems.zoomPanel )
										.on('click', function(e){
											e.originalEvent.deltaY = 1
											$this.sandbox.emit('noteboard-mousewheel', e, 0.2);
										})
										.qtip({
											position: { my: 'top right' }
										});

			$this.elems.btnZoomFix = $('<div>', {Class: 'untBtnZoom icon-contract', title: i18n.zoomFix})
										.appendTo( $this.elems.zoomPanel )
										.on('click', function(e){
											var wWidth = window.innerWidth - 50
												,wHeight = window.innerHeight - 70
												,wRation = wWidth/wHeight
												,ration = $this.target.width() / $this.target.height();

											if (ration > wRation) {
												_zoom( wWidth/$this.target.width() );
												var h = (wHeight - ($this.target.height() * $this.scale)) / 2;
												$this.target.offset({ left: 0, top: 60 + h });
											} else {
												_zoom( wHeight/$this.target.height() );
												var w = (wWidth - ($this.target.width() * $this.scale)) / 2;
												$this.target.offset({ left: w, top: 60 });
											}

											$this.sandbox.emit('noteboard-mousewheel', e);
										})
										.qtip({
											position: { my: 'top right' }
										});

			$this.elems.btnFullScreen = $('<div>', {Class: 'untBtnZoom icon-screen', title: i18n.fullScreen})
										.appendTo( $this.elems.zoomPanel )
										.on('click', function(e){
											fullScreen();
										})
										.qtip({
											position: { my: 'top right' }
										});
		}

		/**
		 * Preserva estados de teclas presionadas
		 *
		 * @param Event e Evento de keydown.
		 * @param int keyCode Código de la tecla presionado.
		 * 
		 */
		var _keydown = function(e, keyCode) {			
			if (e.ctrlKey && (keyCode == 187 || keyCode == 189)) {
				if (keyCode == 187)
					e.originalEvent.deltaY = -1
				else
					e.originalEvent.deltaY = 1

				$this.sandbox.emit('noteboard-mousewheel', e, 0.2);
			}
		}

		/**
		 * Cambia estados de teclas presionadas
		 *
		 * @param Event e Evento de keyup.
		 */
		var _keypress = function(e) {
			var keyCode = e.keyCode || e.which;			
		}

		/**
		 * Evento ejecutado cuando el mouse es oprimido sobre el <noteboard>
		 *
		 * @param Event e Evento de mousedown.
		 */
		var _mousedown = function(e) {
			if ($this.state == $this.states.MOVE)
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/hand-close.png),auto');
		}

		/**
		 * Evento ejecutado cuando el mouse es soltado sobre el <noteboard>
		 *
		 * @param Event e Evento de mouseup.
		 */
		var _mouseup = function(e) {
			if ($this.state == $this.states.MOVE)
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/hand-open.png),auto');
		}

		/**
		 * Efecto de zoom sobre el <noteboard> cuando la rueda del mouse
		 * es activada sobre este.
		 *
		 * @param Event e Evento de mousewheel.
		 */
		var _mousewheel = function(e, delta) {

			// Redimensionando los puntos de Resize de acuerdo a la escala del noteboard.
    		var scale = (1/$this.scale);
    		$('.untResource').find('.untNoteResize').css({
    			'-webkit-transform' : 'scale(' + scale + ')',
				'-moz-transform' : 'scale(' + scale + ')',
				'transform' : 'scale(' + scale + ')'
    		});
    		
			if (!e) return;
			
			if (!delta) delta = 0.02;

			if (e.originalEvent.deltaY > 0) {
				if ($this.scale > $this.minZoom)
    				$this.scale = Math.round( ($this.scale - delta) * 100 ) / 100;
    		} else {
    			if ($this.scale < $this.maxZoom)
    				$this.scale = Math.round( ($this.scale + delta) * 100 ) / 100;
    		}

    		_zoom($this.scale);
		}

		 /**
	     * Se ejecuta cuando hay un clic sobre <window>
	     * 
	     * @param  Event e Evento de <click> sobre <window>
	     * 
	     */
	    var _click = function(e) {
	    	if (e.button == 0 && !e.shiftKey)
	    		_unselectResources();
	    }

		/**
		 * Retorna el modelo que se encuentra en el arreglo <models>
		 * y coincide con el id especificado.
		 * 
		 * @param  int id Id de del recurso al que se encuentra asociado el modelo
		 * 
		 * @return ModelObject   Instancia del objeto <model> que contiene el id especficado.
		 */
		var _getModel = function( id ) {
			for (var i = this.models.length - 1; i >= 0; i--) {
				if (this.models[i].data.id == id)
					return this.models[i];
			}
		}

		/**
		 * Reubica el noteboard de acuerdo a los parámetros especificados.
		 * 
		 * @param  Object data Objetos con los datos left, top
		 *                     Obj -> {left, top}
		 */
		var _moveNoteboard = function(data) {
			$this.target.offset({
				left: -data.left * $this.scale,
				top: (-data.top * $this.scale) + 50
			});			
		}

		/**
		 * Cambia el zoom del noteboard de acuerdo a la escala especificada.
		 * La escala del noteboard debe ser un valor entre 0.24 y 2.4
		 * 
		 * @param  float scale Escala de zoom
		 */
		var _zoom = function(scale) {
			scale = (scale < noteboard.minZoom) ? $this.minZoom : (scale > $this.maxZoom) ? $this.maxZoom : scale;
			$this.scale = scale;

			$this.target.css('-webkit-transform', 'scale(' + $this.scale + ')');
    		$this.target.css('-moz-transform', 'scale(' + $this.scale + ')');
    		$this.target.css('transform', 'scale(' + $this.scale + ')');
		}

		/**
		 * Limpia la selección de notas realizada.
		 */
		var _unselectResources = function() {
			$this.selectedNotes.forEach(function(model){
	    		model.trigger('resource-selecting', false);
	    	});

	    	$this.selectedNotes = [];
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se bloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Note note Objeto note con la información de éste.
		 */
		var _noteLock = function(note) {
			var args = {
				noteId: note.model.data.id,
				user: $this.user
			}

			$this.sandbox.emit('note-lock', args);
		}

		/**
		 * Bloquea la nota asociada al id especificado
		 *
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id } 
		 */
		var _noteLockRT = function(args) {
			if (args.realTime) {
				var model = $this.getModel(args.noteId);
				model.setLocked(true, args.user);
			}
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se dedsbloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Note note Objeto note con la información de éste.
		 */
		var _noteUnlock = function(note) {
			var args = {
				noteId: note.model.data.id
			}

			$this.sandbox.emit('note-unlock', args);
		}

		/**
		 * Desbloquea la nota asociada al id especificado
		 * 
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id }
		 */
		var _noteUnlockRT = function(args) {
			if (args.realTime) {
				var model = $this.getModel(args.noteId);
				model.setLocked(false);
			}
		}

		/**
		 * Selecciona los elementos intrínsecos en el área de selección
		 *
		 * @param Event evt Objeto de evento
		 */
		var _resourceSelectable = function(evt) {
			if (_width < 80 || _height < 80)
				return;

			$this.models.forEach(function(model) {
				if (model.data.l > _left && 
						model.data.t > _top &&
						(model.data.l + model.data.w) < (_left + _width) &&
						(model.data.t + model.data.h) < (_top + _height))
					model.selectingResource({shiftKey: evt.shiftKey, selecting: true});
			});
		}

		/**
		 * Activa el widget de selectable y desactiva el de draggable
		 */
		var _zoomSelectable = function() {
			if (_width > 80 && _height > 80) {

				var wWidth = window.innerWidth
					,wHeight = window.innerHeight - 50
					,wRation = wWidth/wHeight
					,ration = _width/_height;

				if (ration > wRation) {
					_zoom( wWidth/_width );
					var h = (wHeight - (_height * $this.scale)) / 2;
					$this.target.offset({ left: -_left * $this.scale, top: (-_top * $this.scale) + 50 + h });
				} else {
					_zoom( wHeight/_height );
					var w = (wWidth - (_width * $this.scale)) / 2;
					$this.target.offset({ left: -(_left * $this.scale) + w, top: (-_top * $this.scale) + 50 });
				}

				$this.sandbox.emit('noteboard-mousewheel');
				_eventsTool.pointer();
			}
		}

		/**
		 * Cambia el estado en el que se encuentra el Noteboard.
		 * El cambio de estado anula las acciones del estado actual.
		 * 
		 * @param  string state Nuevo estado.
		 */
		var _changeState = function(state) {
			switch($this.state) {
				case $this.states.POINTER:
					$this.models.forEach(function(model){
						if (model.data.ff == 'frame') return;
						model.setLocked(true);
					});
				break;

				case $this.states.MOVE:
					$this.target.draggable('disable');
				break;

				case $this.states.PENCIL:
				case $this.states.ERASER:
					$this.scribble = false;
					$this.target.selectable('enable');
				break;

				case $this.states.TIMELINE:
					if ($this.inactiveTimeline)
						$this.inactiveTimeline();
				break;
			}

			$this.state = state;
			$('.singleton').removeClass('selected');
		}

		/**
		 * Objeto que contiene cada uno de los eventos que se generan con cada herramienta 
		 * de la barra de herramienta.
		 */
		var _eventsTool = {

			/**
			 * Selección de la Herramienta de selección del Noteboard
			 */
			pointer : function() {
				if ($this.state == $this.states.POINTER) return;

				_changeState($this.states.POINTER);
				$this.target.css('cursor', 'auto');
				$this.elems.pointer.addClass('selected');
				$this.models.forEach(function(model){
					model.setLocked(false);
				});
			},

			/**
			 * Selección de la Herramienta de movimiento del Noteboard
			 */
			move : function() {
				if ($this.state == $this.states.MOVE) return;

				_changeState($this.states.MOVE);
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/hand-open.png),auto');
				$this.elems.move.addClass('selected');
				$this.target.draggable('enable');
			},


			/**
			 * Selección de la Herramienta de Zoom
			 */
			zoom : function() {
				if ($this.state == $this.states.ZOOM) return;

				_changeState($this.states.ZOOM);
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/zoom.png),auto');
				$this.elems.zoom.addClass('selected');
			},

			/**
			 * Selección de la Herramienta de Pincel
			 */
			pencil : function() {
				if ($this.state == $this.states.PENCIL) return;

				_changeState($this.states.PENCIL);
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/pencil.png) 5 15,auto');
				$this.elems.pencil.addClass('selected');
				$this.target.selectable('disable');
			},

			/**
			 * Selección de la Herramienta de Pincel
			 */
			eraser : function() {
				if ($this.state == $this.states.ERASER) return;

				_changeState($this.states.ERASER);
				$this.target.css('cursor', 'url(' + WEBROOT_URL + 'img/noteboard/cursors/eraser.png),auto');
				$this.elems.eraser.addClass('selected');
				$this.target.selectable('disable');
			},

			/**
			 * Selección de la Herramienta de Diapositivas
			 */
			timeline : function() {
				if ($this.state == $this.states.TIMELINE) return;

				_changeState($this.states.TIMELINE);
				$this.target.css('cursor', 'auto');
				$this.elems.slides.addClass('selected');
			}
		}

		// Retornando interfaz del módulo
		return {
			id: $('#noteboard').data('noteboardid'),
			target: $('#noteboard'),
			selectedNotes: [],
			areas: [],
			models: [],
			minIndex: 200,
			maxIndex: 200,
			minZoom: 0.28,
			maxZoom: 4,
			init: _init,
			zoom: _zoom,
			getModel: _getModel,
			moveNoteboard: _moveNoteboard,
			unselectResources: _unselectResources,
			noteLock: _noteLock,
			noteUnlock: _noteUnlock,
			ready: function(f) {
				$this.readyFunctions.push(f);
			},
			autoincrement: function() {
				$this.auto_increment += 1;
				return $this.auto_increment;
			},
		}
	}
);