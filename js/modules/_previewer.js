/**
 * Módulo para inclusión de previsualizador
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
		var _init = function() {
			$this = this;
			$this.sandbox = new sandbox($this);
			$this.ration = 20;

			// --- Suscripción a eventos
			$this.sandbox.on('window-resize', _PreviewDrag);
			$this.sandbox.on('noteboard-drag', _PreviewDrag);
			$this.sandbox.on('noteboard-mousewheel', _PreviewDrag);
			
			$this.sandbox.on('resource-add', _createPreviewResource);
			$this.sandbox.on('resource-id', _idPreviewResource);
			$this.sandbox.on('resource-move', _movePreviewResource);
			$this.sandbox.on('resource-resize', _resizePreviewResource);
			$this.sandbox.on('resource-bg', _bgPreviewResource);
			$this.sandbox.on('resource-remove', _removePreviewResource);

			$this.sandbox.on('line-add', _createPreviewLine);

			$this.sandbox.on('timeline-show', _timelineShow);
			$this.sandbox.on('timeline-hide', _timelineHide);

			// Creando Previsualizador
			$this.preview = $('<div>', {id: 'previewer'});
			$this.previewDrag = $('<div>', {Class: 'untPreviewDrag'});

			$this.preview.append($this.previewDrag).appendTo( noteboard.target.parent() );

			// Proporcionando el Preview
			var nbWidth = noteboard.target.width()
				,nbHeight = noteboard.target.height()
				,w = undefined
				,h = undefined;

			if (nbWidth > nbHeight) {
				w = 200;
				h = (nbHeight / nbWidth) * 200;
			} else {
				w = (nbWidth / nbHeight) * 200;
				h = 200;
			}

			$this.preview.css({
				width: w,
				height: h
			});			

			var win = $(window)
				,width = (w * win.width() ) / nbWidth
				,height = (h * win.height() ) / nbHeight;

			$this.ration = nbWidth / w;

			$this.previewDrag
				.css({
					width: width,
					height: height,
					left: window.scrollX / $this.ration,
					top: window.scrollY / $this.ration
				})
				.draggable({
					containment: 'parent',
					start: function(event, ui) {
						noteboard.target.offset({top:50, left: 0});
						_PreviewDrag();
					},
					drag: function(event, ui) {
						var  w1 = ui.helper.outerWidth()
							,h1 = ui.helper.outerHeight()
							,w2 = $this.preview.width()
							,h2 = $this.preview.height();

						ui.position.left = Math.max(Math.min(ui.position.left, w2 - w1), 0);
						ui.position.top = Math.max(Math.min(ui.position.top, h2 - h1), 0);

						var left = ui.position.left * $this.ration
							,top = ui.position.top * $this.ration;

						$this.sandbox.emit('preview-drag', {left: left, top: top});
					}					
				});
		}

		/**
		 * Crea instancia de <PreviewNote> y la añade al <preview>.
		 * 
		 * @param Model model Modelo del recurso a crear un preview.
		 */
		var _createPreviewResource = function( model ) {
			var $divNotePreview = 	$('<div>')
										.css({
											height: model.data.h / $this.ration,
											left: (model.data.l / $this.ration) + 'px',
											position: 'absolute',
											top: (model.data.t / $this.ration) + 'px',
											width: model.data.w / $this.ration
										})
										.data('bg', model.data.bg)
										.addClass( 'untPreviewNote ' + model.data.bg )
										.attr('data-prev-id', model.data.id);

			if (model.data.fs == 'image')
				$divNotePreview.css({
									'background-image': 'url(' + BLOB_IMAGES + model.data.msg + ')',
									'background-size': '100% 100%'
								   });

			if (model.data.fs == 'circle')
				$divNotePreview.css('border-radius', '50%');

			$this.preview.append($divNotePreview);
		}

		/**
		 * Ubica horizontalmente el <$this.previewDrag> de acuerdo al desplazamiento del
		 * scroll horizontal en el noteboard
		 * 
		 * @param  Array args Arreglo de parámetros recibido de acuerdo al evento 'scroll'		 
		 */
		var _PreviewDrag = function() {
			var nLeft = noteboard.target.offset().left
				,nTop = noteboard.target.offset().top
				,nWidth = noteboard.target.width()
				,nHeight = noteboard.target.height()
				,wWidth = window.innerWidth
				,wHeight = window.innerHeight;

			if (nLeft >= 0) {
				$this.previewDrag.css({
					left: 0,
					width: ((wWidth - nLeft) / $this.ration) / noteboard.scale
				});
			
			} else if ((nLeft + nWidth * noteboard.scale) < wWidth) {
				$this.previewDrag.css({
					left: ($this.preview.width() - (nLeft + nWidth) / $this.ration) / noteboard.scale,
					width: $this.preview.width() - (($this.preview.width() - (nLeft + nWidth) / $this.ration) / noteboard.scale)
				});

			} else {
				$this.previewDrag.css({
					left: (-nLeft / $this.ration) / noteboard.scale,
					width: (wWidth / $this.ration) / noteboard.scale
				});
			} 

			if (nTop >= 0) {
				$this.previewDrag.css({
					height: ((wHeight - nTop) / $this.ration) / noteboard.scale,
					top: 0
				});

			} else if ((nTop + nHeight  * noteboard.scale) < wHeight) {			
				$this.previewDrag.css({
					height: $this.preview.height() - (($this.preview.height() - (nTop + nHeight) / $this.ration) / noteboard.scale),
					top: ($this.preview.height() - (nTop + nHeight) / $this.ration) / noteboard.scale
				});
			} else {
				$this.previewDrag.css({
					height: (wHeight / $this.ration) / noteboard.scale,
					top: (-nTop / $this.ration) / noteboard.scale
				});
			}

			// TODO: Puesto temporalmente, permite reposicionar todos los Qtips que están abiertos.
			$('.untNoteComment').qtip('reposition');
		}

		/**
		 * Ubica un <previewNote> de acuerdo a los argumentos especificados
		 * 
		 * @param Object args Objeto de parámetros
		 *              args -> Object {notes: [{left, top, id}] }
		 */
		var _movePreviewResource = function(args) {
			var self = this;

			args.notes.forEach(function(note) {
				$('[data-prev-id=' + note.id + ']', self.preview).css({ 'left': note.left / $this.ration, 'top': note.top / $this.ration });
			});
		}

		/**
		 * Redimensiona un <previewNote> de acuerdo a los argumentos especificados
		 * 
		 * @param Object args Objeto de parámetros
		 *              args -> Object {width, height, id}
		 */
		var _resizePreviewResource = function(args) {
			var self = this;

			args.notes.forEach(function(note) {
				$('[data-prev-id=' + note.id + ']', self.preview).css({ 'width': note.width / $this.ration, 'height': note.height / $this.ration });
			});
		}

		/**
		 * Cambiar el 'background' de un <previewNote> de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {bg, id}
		 */
		var _bgPreviewResource = function(args) {
			var self = this;

			args.notes.forEach(function(note) {
				var elem = $('[data-prev-id=' + note.id + ']', self.preview)
					,oldBG = elem.data('bg');

				elem.removeClass(oldBG).addClass( note.bg ).data('bg', note.bg);
			});
		}

		/**
		 * Elimina el <PreviewNote> especificado
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _removePreviewResource = function(args) {
			var self = this;

			args.notes.forEach(function(note) {
				$('[data-prev-id=' + note.id + ']', self.preview).remove();
			});
		}

		/**
		 * Cambiar el id de <PreviewNote>
		 * 
		 *@param  Object args Objeto de parámetros
		 *                args -> Object {id, newId}
		 */
		var _idPreviewResource = function(args) {
			var self = this;

			$('[data-prev-id=' + args.id + ']', self.preview).attr('data-prev-id', args.newId);
		}

		/**
		 * Permite la creación de una línea vertical u horizontal
		 * 
		 * @param Object args Objeto de parámetros
		 *               args -> Object {left, top}
		 *
		 * @param string dir Define la dirección de la línea (horizontal, vertical)
		 */
		var _createPreviewLine = function(args, dir) {
			var line = $('<div>', {Class: 'untLinePreview'})

			if (dir == 'top') {
				line.css({
						top: args.top / $this.ration,
						width: $this.preview[0].offsetWidth,
						position: 'absolute'
					})
			} else {
				line
					.css({
						left: args.left / $this.ration,
						height: $this.preview[0].offsetHeight,
						position: 'absolute'
					})
			}

			$this.preview.append(line);
		}

		/**
		 * Muestra las areas que están creadas en el previsualizador
		 */
		var _timelineShow = function() {
			$('.transp', $this.preview).show();
		}

		/**
		 * Oculta las areas que están creadas en el previsualizador
		 */
		var _timelineHide = function() {
			$('.transp', $this.preview).hide();
		}

		// Retornando interface del módulo
		return {
			init: _init
		}
	}
)