define(
	[
		WEBROOT_URL + 'js/modules/preview-noteboard.js',
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

			noteboard.createResource = _createResource;
		}

		/**
		 * Crea una nueva nota
		 * 
		 * @param Event e Evento doble click del noteboard
		 */
		var _createResource = function(data) {
			var resource = undefined;

			switch(data.fs) {
				case 'circle':
					resource = new CircleResource(data, noteboard);
					break;

				case 'image':
					resource = new ImageResource(data, noteboard);
					break;

				case 'youtube':
					resource = new VideoResource(data, noteboard);
					break;

				case 'frame':
					resource = new FrameResource(data, noteboard);
					break;

				case 'comment':
					resource = new CommentResource(data, noteboard);
					break;

				default:
					resource = new NoteResource(data, noteboard);
					break;
			}
		}

		 // Retornando interface del módulo
		return {
			init: _init
		}
	}
)