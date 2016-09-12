/**
 * Objeto tipo "Sticky Note" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Objet data Objeto de datos que contiene la información de la nota.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
NoteResource.prototype = Object.create(NoteboardResource.prototype);
function NoteResource( data, noteboard ) {
	var self = this;
	NoteboardResource.call(this, data, noteboard);

	// Aplicando focus en las notas nuevas
	if(this.model.data.isNew) this.view.elems.msg.focus();

	// Escuchando eventos del modelo
	this.model.on('resource-msg', function(name, msg){ self.view.setMsg(msg) });
	this.model.on('resource-bg', function(name, bg){ self.view.setBG(bg) });
	this.model.on('resource-ff', function(name, ff){ self.view.setFF(ff) });
	this.model.on('resource-fs', function(name, fs){ self.view.setFS(fs) });
	this.model.on('resource-c', function(name, c){ self.view.setC(c) });

	this.model.on('resource-attach-zone', function(name, c){ self.view.attachZone() });
}

/**
 * @override Sobre escritura de método View.
 */
NoteResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template.addClass( 'untNote untMenu ' + model.data.bg ).data('attach', model.data.attach).data('bg', model.data.bg);
	view.elems.attach   = $('<div>', {Class: 'icon-attachment'}).appendTo( view.elems.header );
 	view.elems.userLock = $('<img>', {Class: 'user-lock'}).appendTo( view.elems.header );
 	view.elems.msg 		= $('<div>', {Class: 'untNoteContent'
									   		, Name: 'message'
									   		, Spellcheck: 'false'
									   		, contenteditable: 'true'
									   		, maxLength: '500'}).appendTo( view.elems.template );

 	if (model.data.attach && model.data.attach.length > 0)
		view.elems.attach.show();

	// Propiedades y eventos del elemento <msg>
 	var tMsg = null
		,updated = false
		,editing = false
		,lastElem = function(elem) {
						var length = elem.childNodes.length - 1;
						if (length < 0) return elem;
						return lastElem(elem.childNodes[length]);
					}

	// Configurando elemento <msg>
	view.elems.msg
 		.html( model.data.msg )
 		.css({
 			color: model.data.c,
			'font-family': model.data.ff,
			'font-size': model.data.fs,
			height: view.elems.template.height() - 50
		})

		// Gestionando eventos del textarea
		.on('dblclick', function(e){ e.preventDefault(); return false; })
		.on('click', function(e){
			if( model.noteboard.selectedNotes.length != 0 ) {
				var flag = false;
				
				model.noteboard.selectedNotes.forEach(function(m){
					if (m.data.id == model.data.id) {
						flag = true;
						return;
					}
				});

				if (flag) return;
			}

			if (!editing && !model.data.locked && !e.shiftKey) {
				editing = true;
				this.focus();
				view.elems.template.draggable('disable');
				model.noteboard.unselectResources();

				var le = lastElem(this);

				if (le.length) {
					var range = document.createRange()
						,sel = window.getSelection();

					range.setStart(le, le.length);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}

			return false;
		})
		.on('focus', function(){ 
			view.elems.template.addClass('focus');
			model.noteboard.noteLock(self);
		})
		.on('blur', function(e){
			if (!model.data.locked)
				view.elems.template.draggable('enable');

			var msg = $(this).html();

			// Change
			if ( model.data.msg != msg  && !updated) {
				model.setMsg({msg: msg});
				clearTimeout(tMsg);
			}

			editing = false;
			if (document.activeElement != this)
				$('#search').focus().blur();

			view.elems.template.removeClass('focus');
			model.noteboard.noteUnlock(self);
		})
		.on('keydown', function(e, keyCode) {
			var text = $(this).text()
				,r = 500 - text.length;

			if (keyCode == 9 || keyCode == 18) {
				e.preventDefault();
			}

		  	if (keyCode == 13) {
		  		document.execCommand('insertHTML', false, '<br><br>');
		  		return false;
		  	}
		})
		.on('keyup', function(e) {
		  	var msg = $(this).html()
		  		text = $(this).text();

		  	if ( model.data.msg != msg) {
				clearTimeout(tMsg);
			  	updated = false;

			  	tMsg = setTimeout(function(){
			  		model.setMsg({msg: msg});
			  		clearTimeout(tMsg);
			  		updated = true;
			  	}, 1000);
			}
		});

	view.elems.attach.on('click', function() {
    	model.attachZone();
    });

    model.noteboard.target.on('click', function() {
    	view.elems.msg.blur();
    });

	/**
	 * Cambia el tamaño de la nota, y ajusta el tamaño del textarea
	 * asociado a ésta.
	 * 
	 * @param int w Valor <width> del elemento principal asociado.
	 * @param int h Valor <height> del elemento principal asociado.
	 */
	View.prototype.setSize = function(w, h) {
		this.elems.template.css({ 'width': w, 'height': h });
		this.elems.msg.css('height', this.elems.template.height() - 50);
	}

	/**
	 * Cambia el texto de la nota por el mensaje especificado.
	 * 
	 * @param string msg Nuevo mensaje para la nota.
	 */
	View.prototype.setMsg = function(msg) {
		this.elems.msg.html(msg);
	}

	/**
	 * Cambia el color de la nota.
	 * 
	 * @param string bg Nuevo color de la nota en hexadecimal.
	 */
	View.prototype.setBG = function(bg) {
		this.elems.template
			.removeClass( this.elems.template.data('bg') )
			.addClass( bg )
			.data('bg', bg)
	}
	
	/**
	 * Cambia el tipo de fuente de la nota.
	 * 
	 * @param string ff Nuevo tipo de fuente de la nota.
	 */
	View.prototype.setFF = function(ff) {
		this.elems.msg.css('font-family', ff);
	}
	
	/**
	 * Cambia el tamaño de fuente de la nota.
	 * 
	 * @param string fs Nuevo tamaño de fuente de la nota.
	 */	
	View.prototype.setFS = function(fs) {
		this.elems.msg.css('font-size', fs);	
	}
	
	/**
	 * Cambia el color de fuente de la nota.
	 * 
	 * @param string c Nuevo color de fuente de la nota.
	 */	
	View.prototype.setC = function(c) {
		this.elems.msg.css('color', c);
	}

	/**
	 * Inhabilita o habilita todos las opciones de edición del recurso
	 * 
	 * @param boolean Determina si se habilita o no las opciones de edición del recurso.
	 * @param Object user Objeto de datos de usuario.
	 * 
	 */
	View.prototype.locked = function(flag, user) {
		if (flag) {
			this.elems.template.draggable('disable');
			this.elems.msg.removeAttr('contenteditable');
			
			if (user) {
				this.elems.userLock.attr('src', user.profileImage)
								   .attr('title', user.fullname + i18n.userEditing)
								   .show();

			}
		} else {
			this.elems.template.draggable('enable');
			this.elems.msg.attr('contenteditable', 'true');
			this.elems.userLock.hide();
		}
	}

	/**
	 * Permite mostar el panel de archivos adjuntos
	 */
	View.prototype.attachZone = function() {
		var self = this;

		$.untInputWin({
			content: views.formAttachFile(model.data.id, model.noteboard.id),
			classes: 'dropzone',
			width: '100%'
		});

		var dz = new Dropzone("#uploadDropzone", {
			previewTemplate: views.attachFileBlock(),
			maxFilesize: model.noteboard.user.maxFileSize,
			maxFiles: model.noteboard.user.maxFiles,
			success: function(file, data, event) {
				data.size = Math.round(data.size/10000) / 100;
				data.src = $(file.previewElement).find('[data-dz-thumbnail]').attr('src');
				
				self.noteboard.sandbox.emit('note-attach-add', data);
				
				file.previewElement.setAttribute('data-attach', data.name);

				return file.previewElement.classList.add("dz-success");
			},
			error: function(file, data, event) {
				var previewElement = $(file.previewElement);
				previewElement.find('.dz-download').remove();
				previewElement.find('.dz-remove').remove();
				previewElement.find('.dz-delete').css('display', 'block');
				previewElement.find('.dz-error-message').html(data);

				return file.previewElement.classList.add("dz-error");
			}
		});

		var attach = this.elems.template.data('attach')
			, len = attach.length;

		if (attach != undefined) {
			for (var i = len - 1; i >= 0; i--) {
				$('#uploadDropzone').append( views.attachFileBlock( attach[i]) );
			}

			dz.options.maxFiles = dz.options.maxFiles - len;
		}

		untInputWinCenter();
	}


	return view;
}