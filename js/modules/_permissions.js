/**
 * Módulo para definición de permisos de usuario sobre los tableros
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.modules
 * @author      JpBaena13
 */
define(
	[
		WEBROOT_URL + 'js/modules/noteboard.js',		
		WEBROOT_URL + 'js/modules/noteMenu.js',
		WEBROOT_URL + 'js/core/sandbox.js'
	], 
	function(noteboard, noteMenu, sandbox) {

		var $this = undefined;

		/**
		 * Función de inicio de módulo
		 */
		var _init = function(args) {
			$this = this;
			$this.sandbox = new sandbox($this);
			$this.permissions = args.noteboard.owner || args.noteboard.shared;

			// Si es el dueño se conceden todos los servicios.
			if ($this.permissions === true)
				return;

			$this.sandbox.on('resource-load', _loadResource);
			$this.sandbox.on('resource-attach-zone', _attachZone);

			// Deshabilitando edición de notas
			if ($this.permissions.canEdit === 0) {
				noteboard.target.off('dblclick');
				$.contextMenu('destroy', '#noteboard');
				
				noteMenu.itemsDisabled['forward'] = true;
				noteMenu.itemsDisabled['back'] = true;
				noteMenu.itemsDisabled['lock'] = true;
				noteMenu.itemsDisabled['bg'] = true;
				noteMenu.itemsDisabled['size'] = true;
				noteMenu.itemsDisabled['family'] = true;
				noteMenu.itemsDisabled['color'] = true;
				noteMenu.itemsDisabled['remove'] = true;

				var canvas = noteboard.target.find('canvas')
					,box = $('.untNoteboardTools').find('.left .box');

				canvas.off('mousedown')
					  .off('mousemove')
					  .off('mouseup');

				box.find('.colors').remove();
				box.find('.sizes').remove();
			}

			// Deshabilitando eliminación de notas
			if ($this.permissions.canDelete === 0) {
				noteMenu.itemsDisabled['remove'] = true;
			}

			// Deshabilitando hacer comentarios a las notas	
			if ($this.permissions.canComment === 0) {
				$('head').append( '<style>.untCommentTA { display: none; }</style>' );
			}
		}

		/**
		 * Revisa y aplica los permisos concedidos para las notas cargadas.
		 */
		var _loadResource = function() {
			// Deshabilitando edición de notas
			if ($this.permissions.canEdit === 0) {
				$('.untResource')
						.draggable('disable')
						.find('.untNoteResize').remove();
				
				$('.untResource').find('.untNoteHeader').css('cursor', 'default');
				$('.untNote').find('.untNoteContent').removeAttr('contenteditable').off('click');

				// Desabilitando herramientas
				$('#timeline').selectable('destroy');
				$('#timelinePanel').find('ul').sortable('destroy');

				$('#noteboardToolbar').find('.button.pointer').remove();
			}
		}

		/**
		 * Aplica los permisos concedidos al componente de Dropzone desplagado
		 */
		var _attachZone = function() {
			// Evitando carga de archivos
			if ($this.permissions.canUploadFiles === 0) {
				Dropzone.forElement('#uploadDropzone').options.maxFiles = 0;
			}

			// Evitando eliminar archivos adjuntos
			if ($this.permissions.canDeleteAttach === 0) {
				$('.dz-remove').remove();
			}
		}


		// Retornando interface del módulo
		return {
			init: _init
		}

	}
);