/**
 * Módulo para el manejo de tiempo real
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
			$this.socket = { emit: function(){}, on: function(){} };

			// --- Suscripción a eventos
			$this.sandbox.on('resource-add-socket', _createResource);
			$this.sandbox.on('resource-move', _moveResource);
			$this.sandbox.on('resource-resize', _resizeResource);
			$this.sandbox.on('resource-msg', _msgResource);
			$this.sandbox.on('resource-forward', _sendForwardResource);
			$this.sandbox.on('resource-back', _sendBackResource);
			$this.sandbox.on('resource-bg', _BGResource);
			$this.sandbox.on('resource-fs', _FSResource);
			$this.sandbox.on('resource-ff', _FFResource);
			$this.sandbox.on('resource-c', _colorResource);			
			$this.sandbox.on('resource-remove', _removeResource);
			$this.sandbox.on('resource-comment-add', _addCommentResource);

			$this.sandbox.on('note-attach-add', _attachFileNote);
			$this.sandbox.on('note-attach-remove', _attachFileRemoveNote);
			$this.sandbox.on('scribble-add', _scribbleAdd);
			$this.sandbox.on('scribble-clear', _scribbleClear);

			$this.sandbox.on('resource-index-timeline', _indexTimeline);
			$this.sandbox.on('note-lock', _noteLock);
			$this.sandbox.on('note-unlock', _noteUnlock);

			// Descargando socket.io.js
			$.getScript(
				'https://realtime.unnotes.com/socket.io/socket.io.js', 
				function(){
					// Configurando Servido de RealTime
					if (typeof io != 'undefined')
						$this.socket = io.connect('https://realtime.unnotes.com');
					
					$this.socket.emit('matriculate', noteboard.id);

					// Recibiendo notificaciones
					$this.socket.on('noteboard', function(data) {						
						data.realTime = true;
						eval(data.action + '(data)');
					});
				}
			)
		}


		//---------------------------
		//---  Real Time Emit ---
		//---------------------------

		/**
		 * Se encarga de notificar que hay una nueva nota
		 * 
		 * @param  noteDataJSON data Datos de la nota
		 */
		var _createResource = function(data) {
			if (data.realTime)
				return;

			data.action = '_createResourceReal';
			$this.socket.emit(noteboard.id, data);
		}

		/**
		 * Se encarga de notificar que la nota cambió de posición
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {left, top, id, action}
		 */
		var _moveResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_moveResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota cambió de tamaño
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {width, height, id, action}
		 */
		var _resizeResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_resizeResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota cambió el texto
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {msg, id, action}
		 */
		var _msgResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_msgResourceReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Se encaga de notificar un cambio en el index de una nota
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object args -> Object {id}
		 */
		var _sendForwardResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_sendForwardResourceReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Se encaga de notificar un cambio en el index de una nota
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object args -> Object {id}
		 */
		var _sendBackResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_sendBackResourceReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Se encarga de notificar que la nota cambió de color de fondo
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {notes, noteboardid, action}
		 */
		var _BGResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_BGResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota cambió de fuente
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {ff, id, action}
		 */
		var _FFResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_FFResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota cambió de tamaño de fuente
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {fs, id, action}
		 */
		var _FSResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_FSResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota cambió de color de fuente
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {color, id, action}
		 */
		var _colorResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_colorResourceReal';
			$this.socket.emit(noteboard.id, args);
		}
		/**
		 * Se encarga de notificar que la nota fue eliminada
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id, action}
		 */
		var _removeResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_removeResourceReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Se encarga de notificar un nuevo archivo adjunto
		 * 
		 *  @param  Object args Objeto de parámetros
		 *                args -> Object { noteId, name, filename, type, size, realTime, action }
		 */
		var _attachFileNote = function(args) {
			if (args.realTime)
				return;

			args.action = '_attachFileNoteReal';
			$this.socket.emit(noteboard.id, args);
		}		

		/**
		 * Se encarga de notificar un archivo adjunto eliminado
		 * 
		 *  @param  Object args Objeto de parámetros
		 *                args -> Object { noteId, name, filename, type, size, realTime, action }
		 */
		var _attachFileRemoveNote = function(args) {
			if (args.realTime)
				return;

			args.action = '_attachFileRemoveNoteReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Se encaga de notificar un nuevo comentario
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object args -> Object {noteId, fullname, message, action, realTime}
		 */
		var _addCommentResource = function(args) {
			if (args.realTime)
				return;

			args.action = '_addCommentResourceReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Notifica añadición de escritura a mano alzada
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { path: [ {x:_x, y:_y} ,{..}..] }
		 */
		var _scribbleAdd = function(args) {
			if (args.realTime)
				return;

			args.action = '_scribbleAddReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Notifica limpieza del canvas de escritura a mano alzada
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { clear: true }
		 */
		var _scribbleClear = function(args) {
			if (args.realTime)
				return;

			args.action = '_scribbleClearReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Notifica el cambio en el orden de las diapositivas
		 * del timeline
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { id, index }
		 */
		var _indexTimeline = function(args) {
			if (args.realTime)
				return;

			args.action = '_indexTimelineReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se bloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id }
		 */
		var _noteLock = function(args) {
			if (args.realTime)
				return;

			args.action = '_noteLockReal';
			$this.socket.emit(noteboard.id, args);
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se bloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id }
		 */
		var _noteUnlock = function(args) {
			if (args.realTime)
				return;

			args.action = '_noteUnlockReal';
			$this.socket.emit(noteboard.id, args);
		}



		//---------------------------
		//----    Real Time On   ----
		//---------------------------

		/**
		 * Crea una instancia nueva  de <Note> y la añade en el noteboard.
		 *
		 * @param noteDataJSON data Objeto noteDataJSON de una nota ya configurada
		 */
		var _createResourceReal = function(data) {
			var model = {data: data}

			model.data.isNew = false;
			$this.sandbox.emit('resource-add', model);
		}

		/**
		 * Mueve la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {left, top, id}
		 */
		var _moveResourceReal = function(args) {
			$this.sandbox.emit('resource-move', args);
		}

		/**
		 * Cambia el tamaño de la nota
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {width, height, id}
		 */		
		var _resizeResourceReal = function(args) {
			$this.sandbox.emit('resource-resize', args);
		}

		/**
		 * Cambia el texto de la nota
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {msg, id}
		 */		
		var _msgResourceReal = function(args) {
			$this.sandbox.emit('resource-msg', args);
		}

		/**
		 * Modifica el index de la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object args -> Object {id}
		 */
		var _sendForwardResourceReal = function(args) {
			$this.sandbox.emit('resource-forward', args);
		}

		/**
		 * Modifica el index de la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object args -> Object {id}
		 */
		var _sendBackResourceReal = function(args) {
			$this.sandbox.emit('resource-back', args);
		}

		/**
		 * Cambia el color de fondo de la nota
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {notes, noteboardid, action}
		 */		
		var _BGResourceReal = function(args) {
			$this.sandbox.emit('resource-bg', args);
		}

		/**
		 * Cambia el tipo de fuente de la nota
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {fs, id, action} 
		 */		
		var _FFResourceReal = function(args) {
			$this.sandbox.emit('resource-ff', args);
		}

		/**
		 * Cambia el tamaño de fuente de la nota
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {fs, id, action}
		 */		
		var _FSResourceReal = function(args) {
			$this.sandbox.emit('resource-fs', args);
		}

		/**
		 * Cambia el color de fuente de la nota
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {color, id, action}
		 */		
		var _colorResourceReal = function(args) {
			$this.sandbox.emit('resource-c', args);
		}

		/**
		 * Elimina la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id, action}
		 */		
		var _removeResourceReal = function(args) {
			$this.sandbox.emit('resource-remove', args);
		}

		/**
		 * Añade los datos del archivo adjunto especificado en 
		 * la <Note> que le corresponde.
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object { noteId, name, filename, type, size, realTime, action }
		 */
		var _attachFileNoteReal = function(args) {
			$this.sandbox.emit('note-attach-add', args);
		}

		/**
		 * Elimina los datos del archivo adjunto especificado en 
		 * la <Note> que le corresponde.
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object { noteId, name, filename, type, size, realTime, action }
		 */
		var _attachFileRemoveNoteReal = function(args) {
			$this.sandbox.emit('note-attach-remove', args);
		}

		/**
		 * Añade un comentario a la nota especificada.
		 * 
		 * @param Object args Objeto de parámetros
		 *                    args -> Object {noteId, fullname, message, action, realTime}
		 */
		var _addCommentResourceReal = function(args) {
			$this.sandbox.emit('resource-comment-add', args);
		}

		/**
		 * Notifica añadición de escritura a mano alzada.
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { path }
		 */
		var _scribbleAddReal = function(args) {
			$this.sandbox.emit('scribble-add', args);
		}

		/**
		 * Notifica añadición de escritura a mano alzada.
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { clear }
		 */
		var _scribbleClearReal = function(args) {
			$this.sandbox.emit('scribble-clear', args);
		}

		/**
		 * Notifica el cambio en el orden de las diapositivas
		 * del timeline
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { id, index }
		 */
		var _indexTimelineReal = function(args) {
			$this.sandbox.emit('resource-index-timeline', args);
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se bloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id }
		 */
		var _noteLockReal = function(args) {
			$this.sandbox.emit('note-lock', args);
		}

		/**
		 * Emite señal a través del servidor de tiempo real para que se bloquee
		 * la nota en los tableros de los colaboradores
		 * 
		 * @param  Array args Objeto de parámetros
		 *               args -> Object { id }
		 */
		var _noteUnlockReal = function(args) {
			$this.sandbox.emit('note-unlock', args);
		}

		return {
			init: _init
		}
	}
);