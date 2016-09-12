/**
 * Módulo para crear persistencia de notas
 * tanto offline como online.
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

			// --- Suscripción a eventos
			$this.sandbox.on('resource-add', _saveResource);
			$this.sandbox.on('resource-move', _savePositionResource);
			$this.sandbox.on('resource-resize', _saveResizeResource);
			$this.sandbox.on('resource-msg', _saveMsgResource);
			$this.sandbox.on('resource-forward', _sendForwardResource);
			$this.sandbox.on('resource-back', _sendBackResource);
			$this.sandbox.on('resource-bg', _saveBGResource);
			$this.sandbox.on('resource-fs', _saveFSResource);
			$this.sandbox.on('resource-ff', _saveFFResource);
			$this.sandbox.on('resource-c', _saveColorResource);
			$this.sandbox.on('resource-remove', _removeResource);
			$this.sandbox.on('resource-comment-add', _addCommentResource);

			$this.sandbox.on('resource-index-timeline', _indexTimeline);
			
			$this.sandbox.on('scribble-add', _scribbleAdd);
			$this.sandbox.on('scribble-clear', _scribbleClear);

			_loadResource();
		}

		/**
		 * Carga las notas en el noteboard
		 */
		var _loadResource = function() {
			$.getJSON(
				API + 'Note/AllNotes/' + noteboard.id,
	       		function(data) {
					$this.sandbox.emit('resource-load', data);
       			}
       		);

       		// Cargando Scribble
			$.getJSON(
				API + 'Scribble/Noteboard/' + noteboard.id,
				function(data) {
					$this.sandbox.emit('scribble-load', data);
				}
			);
		}

		/**
		 * Almacena una nueva nota con los datos especificados.
		 * 
		 * @param Model model Modelo del recurso a guardar.
		 */
		var _saveResource = function( model ) {
			if (model.data.isNew) {
				$.post(
					API + 'Note',
					model.data,
					function(data) {
						model.setId( data.id );
					}
				);	
			}
		}

		/**
		 * Hace el llamado al API de UnNotes para actualizar una nota.
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {action, id, *} *Parámetros según 'action'
		 */
		var _updateNote = function(args) {
			if (args.realTime)
				return;
			
			if ( isNaN(parseInt(args.id))) {
				_saveResource( noteboard.getModel(args.id) );
				return;
			}

			$.ajax({
				url: API + 'Note/' + args.id,
				data: args,
				type: 'PUT'
			});
		}

		/**
		 * Hace llamado al API de UnNotes para actualizar un conjunto de notas.
		 * 
		 * @param  Object args Objeto de parámetros
		 *                     args -> Object {notes, noteboardid}
		 */
		var _updateMultipleNotes = function(args) {
			if (args.realTime)
				return;

			$.ajax({
				url: ROOT_URL + 'Note/Multiple',
				data: args,
				type: 'POST'
			});
		}

		/**
		 * Elimina el registro de la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _removeResource = function(args) {
			if (args.realTime)
				return;

			if (args.notes) {
				args.action = 'remove';
				_removeMultipleResources(args);
				return;
			}

			$.ajax({
				url: API + 'Note/' + args.id,
				type: 'DELETE'
			});
		}

		/**
		 * Elimina el registro de la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {notes, noteboardid}
		 */
		var _removeMultipleResources = function(args) {
			if (args.realTime)
				return;

			$.ajax({
				url: ROOT_URL + 'Note/Multiple',
				data: args,
				type: 'POST'
			});
		}


		/**
		 * Guarda la nueva posición de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {left, top, id}
		 */
		var _savePositionResource = function(args) {
			args.action = 'position';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda el tamaño de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {width, height, id}
		 */
		var _saveResizeResource = function(args) {
			args.action = 'resize';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda la  de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {msg, id}
		 */
		var _saveMsgResource = function(args) {
			args.action = 'msg';
			_updateNote(args);
		}

		/**
		 * Guarda la  de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {notes[id, bg], noteboardid}
		 */
		var _saveBGResource = function(args) {
			args.action = 'bg';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda la  de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {notes[id, ff], noteboardid}
		 */
		var _saveFFResource = function(args) {
			args.action = 'ff';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda la  de la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {fs, id}
		 */
		var _saveFSResource = function(args) {
			args.action = 'fs';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {color, id}
		 */
		var _saveColorResource = function(args) {
			args.action = 'c';
			_updateMultipleNotes(args);
		}

		/**
		 * Guarda la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _sendBackResource = function(args) {
			args.action = 'index';
			args.index = noteboard.minIndex;

			_updateNote(args);
		}

		/**
		 * Guarda la nota de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _sendForwardResource = function(args) {
			args.action = 'index';
			args.index = noteboard.maxIndex;
			
			_updateNote(args);
		}

		/**
		 * Guarda el comentario de acuerdo a los argumentos.
		 * 
		 * @param Object args Objeto de parámetros
		 *                    args -> Object {noteId, fullname, message, action, realTime}
		 */
		var _addCommentResource = function(args) {
			if (args.realTime)
				return;

			$.post(
                API + 'Comment',
                args
            );
		}

		/**
		 * Guarda el <scribble> de acuerdo a los argumentos.
		 *
		 * @param Object args Objeto de parámetros
		 *                    args -> Object { path, brushColor, brushSize}
		 */
		var _scribbleAdd = function(args) {
			if (args.realTime)
				return;

			$.post(
				API + 'Scribble',
				args
			);
		}

		/**
		 * Guarda un <scribble> de limpieza para el noteboard en cuestión.
		 *
		 * @param Object args Objeto de parámetros
		 *                    args -> Object { path, brushColor, brushSize}
		 */
		var _scribbleClear = function(args) {
			if (args.realTime)
				return;

			$.getJSON( API + 'Scribble/Clear/' + noteboard.id );
		}

		/**
		 * Modifica y reorganiza el orden del timeline de acuerdo
		 * a los parámetros especificados
		 * 
		 * @param  Array args Arreglos de coordenadas a pintar en el canvas
		 *               args -> Object { id, index, resource }
		 */
		var _indexTimeline = function(args) {
			if (args.realTime)
				return;

			$.ajax({
				url: API + 'Note/IndexTimeline/',
				data: { resources: args.resources },
				type: 'POST'
			});				
		}		

		// Retornando interface del módulo
		return {
			init: _init
		}
	}
);