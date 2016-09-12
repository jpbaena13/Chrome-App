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
			$this.sandbox.on('noteboard-dblclick', _createResource);
			$this.sandbox.on('noteboard-drop', _noteboardDrop);
			$this.sandbox.on('resource-load', _loadResources);
			$this.sandbox.on('window-keyup', _keyup);

			//Eventos que son emitidos por RealTime
			$this.sandbox.on('resource-add', _createResourceRT);
			$this.sandbox.on('resource-move', _moveResource);
			$this.sandbox.on('resource-resize', _resizeResource);
			$this.sandbox.on('resource-msg', _msgResource);
			$this.sandbox.on('resource-back', _sendBackResource);
			$this.sandbox.on('resource-forward', _sendForwardResource);			
			$this.sandbox.on('resource-bg', _BGResource);
			$this.sandbox.on('resource-ff', _FFResource);
			$this.sandbox.on('resource-fs', _FSResource);
			$this.sandbox.on('resource-c', _colorResource);
			$this.sandbox.on('resource-remove', _removeResource);
			$this.sandbox.on('resource-downloadImage', _downloadImage);
			$this.sandbox.on('resource-previewImage', _previewImage);
			$this.sandbox.on('resource-comment-add', _addCommentResource);
			$this.sandbox.on('resource-loaded', _resourceLoaded);

			$this.sandbox.on('note-attach-add', _attachFileNote);
			$this.sandbox.on('note-attach-remove', _attachFileRemoveNote);

			// Eventos por menú contextual del <noteboard>
			$this.sandbox.on('resource-note', _createResource);
			$this.sandbox.on('resource-image', _imageResource);
			$this.sandbox.on('resource-video', _videoResource);
			$this.sandbox.on('resource-circle', _circleResource);
			$this.sandbox.on('resource-comment', _commentResource);

			_invokeEventAttach();
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

		/**
		 * Crea una instancia de nota y la añade al noteboard siempre y cuando
		 * <data.realTime> sea <true>
		 * 
		 * @param  Model model Modelo del recurso a crear.
		 */
		var _createResourceRT = function( model ) {
			if (model.data.realTime)
				_createResource(model.data);
		}

		/**
		 * Mueve la nota a la posición especificada
		 * 
		 * @param  Array args Arreglo de objeto de parámetros
		 *                args -> Object {[left, top, id, action]}
		 */
		var _moveResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					noteboard.getModel(note.id).setPosition(note.left, note.top);
				});
			}
		}

		/**
		 * Cambia el tamaño de la nota especificada
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {width, height, id, action}
		 */		
		var _resizeResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					noteboard.getModel(note.id).setSize(note.width, note.height);
				});
			}
		}

		/**
		 * Cambia el texto de la nota
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {msg, id}
		 */		
		var _msgResource = function(args) {
			if (args.realTime) {
				noteboard.getModel(args.id).setMsg(args);
			}
		}

		/**
	     * Cambia el index de la nota envíandola detrás de todas.
	     *
	     * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
	     */
	    var _sendForwardResource = function(args) {
	    	if (args.realTime) {
	    		noteboard.getModel(args.id).incrementIndex(args);
	    	}
	    }

		/**
	     * Cambia el index de la nota envíandola detrás de todas.
	     *
	     * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
	     */
	    var _sendBackResource = function(args) {
	    	if (args.realTime) {
	    		noteboard.getModel(args.id).decrementIndex(args);
	    	}
	    }

		/**
		 * Cambiar el 'background' de un <Note> de acuerdo a los argumentos
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {bg, id}
		 */
		var _BGResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					note.realTime = true;
					noteboard.getModel(note.id).setBG(note);
				});
			}
		}

		/**
		 * Modifica el tipo de fuente del <textarea> asociado al <note>
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {ff, id}
		 */
		var _FFResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					note.realTime = true;
					noteboard.getModel(note.id).setFF(note);
				});			
			}
		}

		/**
		 * Modifica el tamaño de fuente del <textarea> asociado al <note>
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {fs, id}
		 */
		var _FSResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					note.realTime = true;
					noteboard.getModel(note.id).setFS(note);
				});	
			}
		}

		/**
		 * Modifica el color de fuente del <textarea> asociado al <note>
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {c, id}
		 */
		var _colorResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					note.realTime = true;
					noteboard.getModel(note.id).setC(note);
				});	
			}
		}

		/**
		 * Elimina el <note> especificado
		 * 
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _removeResource = function(args) {
			if (args.realTime) {
				args.notes.forEach(function(note){
					note.realTime = true;
					noteboard.getModel(note.id).remove(note);
				});
			}
		}

		/**
	     * Añade un comentarios al Qtip indicado
	     *
	     * @param Object args Contiene los datos que serán enviados a los démás módulos
 		 *                    Obj-> {noteId, fullname, profileImage, msg}
	     */
	    var _addCommentResource = function(args) {
    		if (args.realTime) {
    			noteboard.getModel(args.noteId).addComment(args);
    		}
	    }

		/**
		 * Instancia todas las notas pasadosas por parámetros
		 *
		 * @param Array resource Arreglos con las notas (Objects) a instanciar.
		 */
		var _loadResources = function(resource) {
			for (var i = 0, len = resource.length; i < len; i++) {
				resource[i].isNew = false;
				_createResource(resource[i]);
				
				if (noteboard.minIndex > resource[i].index)
					noteboard.minIndex = resource[i].index;

				if (noteboard.maxIndex < resource[i].index)
					noteboard.maxIndex = resource[i].index;
			}
			
			$('.untMainContent').find('.untLoader').remove();
			$this.sandbox.emit('resource-loaded');
		}

	    /**
		 * Añade los datos de archivo adjunto a la nota especificada.
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {noteId, name, filename, type, size, realTime, action}
		 */
		var _attachFileNote = function(args) {			
			var note = $('[data-id=' + args.noteId + ']')
				,attach = note.data('attach') || [];
			
			attach.push(args);
			note.data('attach', attach);
			
			note.find('.icon-attachment').show();
		}

		/**
		 * Elimina los datos de archivo adjunto a la nota especificada.
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {noteId, name, filename, type, size, realTime, action}
		 */
		var _attachFileRemoveNote = function(args) {
			var note = $('[data-id=' + args.noteId + ']')
			,attach = note.data('attach');

			var attach = jlinq.from(attach).equals('name', args.name).removed();
			note.data('attach', attach);


			if (!attach.length) {
				note.find('.icon-attachment').hide();
			}
		}

		/**
		 * Eventos que se deben de ejecutar sobre los adjuntos cuando se desea
		 * eliminar o descargar alguno de éstos.
		 * 
		 */
		var _invokeEventAttach = function() {

			// Evento para visualizar un archivo con Google Docs
			$(document).on('click', '.dz-view', function() {
				var parent = $(this).parent()
					,attachName = parent.data('attach')
					,url = 'https://docs.google.com/viewer?url=https://unnotestorage.blob.core.windows.net/files/' + attachName
					,w = 800
					,h = 600
					,l = (screen.width/2)-(w/2)
  					,t = (screen.height/2)-(h/2);

				window.open(url,'Ideozone','toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width='+w+',height='+h+',top='+t+',left='+l);
			});

			//Evento para eliminar adjunto
			$(document).on('click', '.dz-remove', function() {
				var parent = $(this).parent()
					,attachName = parent.data('attach');

				parent.find('.dz-view').hide();
				parent.find('.dz-download').hide();
				parent.find('.dz-remove').hide();

				$.ajax({
					url: API + 'Files/',
					type: 'DELETE',
					data: {
						noteboardId: noteboard.id,
						attach: attachName
					},
					success: function(data) {
						parent.addClass('dz-error').find('.dz-error-message').html( i18n.attachDeleted );
						parent.find('.dz-view').remove();
						parent.find('.dz-download').remove();
						parent.find('.dz-remove').remove();
						
						$this.sandbox.emit('note-attach-remove', data);
					},
					error: function(data) {
						parent.find('.dz-view').show();
						parent.find('.dz-download').show();
						parent.find('.dz-remove').show();
					}
				});
			});

			//Evento para descargar adjunto
			$(document).on('click', '.dz-download', function() {
				var $this = $(this)
					,parent = $this.parent()
					,attachName = parent.data('attach');

				var iframe = $('<iframe>', {src: API + 'Files/Download/' + attachName }).css('display', 'none');
				iframe.appendTo( $('body') ).load(function() {
					var ifr = this.contentDocument || this.contentWindow.document
						, data = ifr.getElementsByTagName('pre')[0].innerHTML;
					
					data = $.parseJSON(data);
					validateData(data);
				});
			});

			//Evento para descargar adjunto
			$(document).on('click', '.dz-delete', function() {
				$(this).parent().remove();
			});
		}

		/**
		 * Muestra componente dropzone para subir la imagen para añadir al noteboard.
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {evt}
		 */
		var _imageResource = function(args) {
			var left = args.l
				,top = args.t

			$.untInputWin({
				content: views.formUploadImage(left, top, noteboard.id),
				classes: 'dropzone',
				width: '90%'
			});

			new Dropzone("#uploadDropzone", {
				previewTemplate: views.attachFileBlock(),
				maxFilesize: 2,
				maxFiles: 1,
				acceptedFiles: 'image/*',
				success: function(file, data, event) {
					untInputWinRemove();
					_createResource(data);
				},
				error: function(file, data, event) {
					var previewElement = $(file.previewElement);
					previewElement.find('.dz-download').remove();
					previewElement.find('.dz-remove').remove();
					previewElement.find('.dz-delete').css('display', 'block');
					previewElement.find('.dz-error-message').html(data);

					return file.previewElement.classList.add("dz-error");
				}

			}).on("maxfilesexceeded", function(file){
			    this.removeFile(file);
			});
		}

		/**
		 * Muestra ventana modal solicitando la URL del video desde YouTube
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {evt}
		 */
		var _videoResource = function(args) {
			$field = $('<input>', {type: 'text', id: "videoURL"}).attr('placeholder', i18n.addVideoMsg);

			$.untInputWin({
				title: 'Insertar Video',
				content: $field,
				width: 400,
				clickAccept: function() {
					var data = {}
			    		, url = $field.val()
			    		, id = youtubeID(url);

			    	if (!id) {
			    		$.untInputWin({
			    			title: i18n.incorrectYoutubeURL,
			    			content: i18n.incorrectYoutubeURLMsg
			    		});

			    		return false;
			    	}

					url = 'https://www.youtube.com/embed/' + id;

					data.bg	= 'gray';
					data.c	= '000000';
					data.fs	= 'youtube';
					data.ff	= 'youtube';
					data.h	= 350;
					data.id	= 't' + noteboard.autoincrement();
					data.l	= args.l;
					data.msg= url;
					data.t	= args.t;
					data.w	= 450;
					data.index = 200;
					data.isNew = true;
					data.realTime = false;

					_createResource(data);
				}
			})
		}

		/**
		 * Crea una nota especial con forma circular
		 * 
		 * @param  Event args Evento de click sobre el tablero
		 */
		var _circleResource = function(args) {
			var data = {
				l: args.l,
				t: args.t,
				c: 'circle',
				ff: 'circle',
				fs: 'circle'
			}

			_createResource(data);
		}

		/**
		 * Crea una comentario dentro del noteboard
		 * 
		 * @param  Event args Evento de click sobre el tablero
		 */
		var _commentResource = function(args) {
			var data = {
				l: args.l,
				t: args.t,
				ff: 'comment',
				fs: 'comment',
				w: 40,
				h: 30
			}

			_createResource(data);
		}

		/**
		 * Crea un iframe que permite descargar la imagen asociado a los parámetros especificados.
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _downloadImage = function(args) {
			var iframe = $('<iframe>', {src: API + 'Files/Download/' + $('#n-' + args.id).data('imageName') + '?image=1' }).css('display', 'none');
			iframe.appendTo( $('body') ).load(function() {
				var ifr = this.contentDocument || this.contentWindow.document
					, data = ifr.getElementsByTagName('body')[0].innerHTML;

				data = $.parseJSON(data);
				validateData(data.msg, i18n.errFileDownload, i18n.errFileDownloadMsg)
			});
		}

		/**
		 * Permite visualizar la imagen seleccionada en una ventana de dialogo
		 *
		 * @param  Object args Objeto de parámetros
		 *                args -> Object {id}
		 */
		var _previewImage = function(args) {
			$.untInputWin('<img class="untWinImage" src="' + CDN_IMAGES + $('#n-' + args.id).data('imageName') + '">');
			untInputWinCenter();
		}

		/**
	     * Función que se ejecuta una vez las notas fueron cargadas para realizar
	     * varias tareas de utilidad.
	     */
	    var _resourceLoaded = function() {
	    	//Ubica el tablero sobre la nota determinada
			var noteId = window.location.hash.split('&')[0]
				,note = $(noteId);

			if (note.length == 0)
				return;

			var nx = noteboard.target.width()
				,ny = noteboard.target.height()
				,wx = window.innerWidth
				,wy = window.innerHeight
				,a = nx - wx
				,b = ny - wy
				,t = note.position().top
				,l = note.position().left;			

			noteboard.moveNoteboard({'left': l - 20, 'top': t - 20});

			//Efecto de focus sobre la nota determinada
			var timeout = null
				,shadow = note.css('box-shadow');
			
			(function noteLighter(){
				note.css('box-shadow', '0px 0px 20px yellow')
				timeout = setTimeout(function(){
					note.css('box-shadow', 'none')
					timeout = setTimeout(function(){
						noteLighter();
					}, 500);
				}, 500);
			})();

			setTimeout(function(){
				clearTimeout(timeout);
				note.css('box-shadow', shadow)
			},3000)

			$this.sandbox.emit('noteboard-drag');

			if (window.location.hash.split('&')[1] == 'comment')
				note.find('.untNoteComment').css('display', 'block').click();
	    }

	    /**
	     * Se ejecuta cuando se "droppea" un elementos sobre el noteboard
	     *
	     * @param  Event e Evento de <click> sobre <window>
	     */
	    var _noteboardDrop = function(e) {
	    	var url = e.originalEvent.dataTransfer.getData('Text')
	    	 	, id = youtubeID(url)
	    	 	, isImage = imagePattern.test(url);



	    	if (id)
	    		_drop.video(e, id);
	    	
	    	if (isImage) {
	    		url = url.split('?')[0];

	    		var protocol = url.substring(0,4);
	    		
	    		if (protocol != 'http') url = 'http://' + url;

	    		_drop.image(e, url);
	    	}
	    }

	    /**
	     * Conjunto de funciones que son llamdas cuando se realiza un drop sobre el tablero.
	     * El evento _noteboardDrop se encarga de determinar que tipo de acción se debe de hacer
	     * y llama a la funcion correspondiente.
	     */
	    var _drop = {

		    /**
		     * Permite añadir un nuevo video desde YouTube al tablero cuando la URL es arrastrada a éste.
		     * 
		     * @param  Event e  Evento drop sobre el tablero
		     * 
		     * @param  string id ID del video desde YouTube
		     */
	    	video: function(e, id) {
	    		var url = 'https://www.youtube.com/embed/' + id
	    			, data = {};

				data.bg	= 'gray';
				data.c	= '000000';
				data.fs	= 'youtube';
				data.ff	= 'youtube';
				data.h	= 350;
				data.id	= 't' + noteboard.autoincrement();
				data.l	= (e.originalEvent.pageX - noteboard.target.offset().left) / noteboard.scale;
				data.msg= url;
				data.t	= (e.originalEvent.pageY - noteboard.target.offset().top) / noteboard.scale;
				data.w	= 450;
				data.index = 200;
				data.isNew = true;
				data.realTime = false;

				_createResource(data);
	    	},

	    	/**
	    	 * Añade una nueva imagen al tablero cuando la URL de ésta es arrastrada.
	    	 *
	    	 * @param  Event e  Evento drop sobre el tablero
	    	 * 
	    	 * @param  string url URL de la imagen
	    	 */
	    	image: function(e, url) {
	    		var left = (e.originalEvent.pageX - noteboard.target.offset().left) / noteboard.scale
	    			,top = (e.originalEvent.pageY - noteboard.target.offset().top) / noteboard.scale
	    			,load = $('<img>', {src: WEBROOT_URL + 'img/default/loader.gif', width: '30px', height: '30px'})
	    						.appendTo( noteboard.target )
	    						.css('position', 'absolute')
	    						.css('left', left)
	    						.css('top', top);

	    		$.ajax({
	    			url: ROOT_URL + 'Files/ImageURL',
	    			data: {
	    				noteboardId: noteboard.id,
	    				left: left,
	    				top: top,
	    				url: url
	    			},
	    			type: 'POST',
	    			dataType: 'JSON',
	    			success: function(data) {
	    				_createResource(data);
	    				load.remove();
	    			}
	    		});
	    	}
	    }

	    /**
	     * Controla los shorcut de teclado para las interacciones con los recuros
	     * 
	     * @param  Event e       Evento keyup de window
	     * @param  int keyCode 	 Código de tecla presionada
	     */
	    var _keyup = function(e, keyCode) {
	    	if (noteboard.selectedNotes.length > 1) {
	    		// Left
	    		if (keyCode == 76) {
	    			var left = noteboard.selectedNotes[0].data.l;
	    			
	    			noteboard.selectedNotes.forEach(function(model){
	    				model.setPosition(left, model.data.t);
	    			});

	    			noteboard.selectedNotes[0].dropping();
	    		}

	    		// Right
	    		else if (keyCode == 82) {
	    			var left = noteboard.selectedNotes[0].data.l,
	    				w = noteboard.selectedNotes[0].data.w;
	    			
	    			noteboard.selectedNotes.forEach(function(model){
	    				var l = left - (model.data.w - w);
	    				model.setPosition(l, model.data.t);
	    			});

	    			noteboard.selectedNotes[0].dropping();
	    		}

	    		// Top
	    		else if (keyCode == 84) {
	    			var top = noteboard.selectedNotes[0].data.t;
	    			
	    			noteboard.selectedNotes.forEach(function(model){
	    				model.setPosition(model.data.l, top);
	    			});

	    			noteboard.selectedNotes[0].dropping();
	    		}

	    		// Bottom
	    		else if (keyCode == 66) {
	    			var top = noteboard.selectedNotes[0].data.t,
	    				h = noteboard.selectedNotes[0].data.h;
	    			
	    			noteboard.selectedNotes.forEach(function(model){
	    				var t = top - (model.data.h - h);
	    				model.setPosition(model.data.l, t);
	    			});

	    			noteboard.selectedNotes[0].dropping();
	    		}

	    		// Delete
	    		else if (keyCode == 46) {
	    			noteboard.selectedNotes[0].remove( {} );
	    		}
	    	}
	    }

		 // Retornando interface del módulo
		return {
			init: _init
		}
	}
)