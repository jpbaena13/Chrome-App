/**
 * Este objeto funciona como base para cualquier tipo de recurso que se desee añadir
 * a un <noteboard>,
 * 
 * @param Objet data Objeto de datos que contiene la información del recurso.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
function NoteboardResource( data, noteboard ) {
	var self = this;

	this.noteboard = noteboard;
	this.model = new Model( data, this.noteboard );
	this.view = this.View();

	// Añadiendo el recurso al noteboard
	this.noteboard.target.append( this.view.elems.template );

	// Escuchando eventos del modelo
	this.model.on('resource-id', function(name, id){ self.view.setId(id); });
	this.model.on('resource-position', function(name, l, t){ self.view.setPosition(l, t) });
	this.model.on('resource-resize', function(name, w, h){ self.view.setSize(w, h) });
	this.model.on('resource-remove', function(name){ self.view.remove() });
	this.model.on('resource-selecting', function(name, e){ self.view.selectingResource(e) });
	this.model.on('resource-index', function(name, index){ self.view.changeIndex(index) });
	this.model.on('resource-comment-add', function(name, args){ self.view.addComment(args) });
	this.model.on('resource-locked', function(name, args, user){ self.view.locked(args, user) });

	// Escuchando eventos de la vista
	this.view.on('resource-click', function(name, e){ self.model.selectingResource(e); });
	this.view.on('resource-dblclick', function(name, e){ self.model.incrementIndex({}) });
	this.view.on('resource-drag', function(name, event, ui){ self.model.dragging(event, ui) });
	this.view.on('resource-stop', function(name, event, ui){ self.model.dropping(event, ui) });
	this.view.on('resource-dragResize', function(name, event, ui){ self.model.draggingResize(event, ui) });
	this.view.on('resource-stopResize', function(name, event, ui){ self.model.droppingResize(event, ui) });
}
/**
 * Retorna el Objeto principal jQuery del recurso.
 * 
 * @return JQuery Objeto jQuery del recruso.
 */
NoteboardResource.prototype.template = function() {
	return this.view.elems.template;
}

/**
 * Permite definir la Vista genérica del Recurso. Este vista deberá
 * ser sobre-escrita por todos los objetos que hereden de éste.
 * 
 * @param Model model Instancia del módelo asociado a este objeto.
 *
 * @return View Retorna la definición del objeto View.
 */
NoteboardResource.prototype.View = function( model ) {
	View.prototype = new Observable();
	function View() {
		var self = this
			,pointerX
			,pointerY
			,noteboardTop 
	    	,noteboardLeft
	    	,noteboardHeight
	    	,noteboardWidth;

		this.noteboard = model.noteboard;
		this.dragging = false

		this.elems = {};
		this.elems.template = $('<div>', {Class: 'untResource'}).attr('id', 'n-' + model.data.id).attr('data-id', model.data.id).data('model', model);
		this.elems.header   = $('<div>', {Class: 'untNoteHeader'}).appendTo( this.elems.template );
 		this.elems.resize   = $('<div>', {Class: 'untNoteResize'}).appendTo( this.elems.template );
 		this.elems.comment  = $('<div>', {Class: 'untNoteComment icon-bubbles'}).appendTo( this.elems.header );
 		this.elems.shadow 	= $('<div>', {Class: 'shadow ei-bottom-left-shadow'}).appendTo( this.elems.template); 		
 		
 		
 		// Configurando Template
 		this.elems.template
	 		.css({
				height: model.data.h,
				left: model.data.l + 'px',
				position: 'absolute',
				top: model.data.t + 'px',
				width: model.data.w,
				'z-index': model.data.index
			})
			.on('click', function(e) { 
				(!model.data.dragging && self.noteboard.state == self.noteboard.states.POINTER) ? self.trigger('resource-click', e) : model.data.dragging = false;
				return false; 
			})
			// .on('dblclick', function(e) { self.trigger('resource-dblclick', e); return false; })
			.draggable({
							containment: 'parent',
							start: function(evt, ui) {
								pointerY = (evt.pageY - self.noteboard.target.offset().top) / self.noteboard.scale - parseInt($(evt.target).css('top'));
								pointerX = (evt.pageX - self.noteboard.target.offset().left) / self.noteboard.scale - parseInt($(evt.target).css('left'));
								
								ui.originalPosition.top = ui.originalPosition.top / self.noteboard.scale;
								ui.originalPosition.left = ui.originalPosition.left / self.noteboard.scale;
								
								noteboardTop = self.noteboard.target.offset().top;
						    	noteboardLeft = self.noteboard.target.offset().left;
						    	noteboardHeight = self.noteboard.target.height();
						    	noteboardWidth = self.noteboard.target.width();

						    	model.data.dragging = true;
							},
							drag: function(evt, ui) {
								
								// Fix for noteboard.scale
							    ui.position.top = Math.round((evt.pageY - noteboardTop) / self.noteboard.scale - pointerY);
							    ui.position.left = Math.round((evt.pageX - noteboardLeft) / self.noteboard.scale - pointerX);

							    // Check if element is outside noteboard
							    if (ui.position.left < 0) ui.position.left = 0;
							    if (ui.position.left + $(this).width() > noteboardWidth) ui.position.left = noteboardWidth - $(this).width();  
							    if (ui.position.top < 0) ui.position.top = 0;
							    if (ui.position.top + $(this).height() > noteboardHeight) ui.position.top = noteboardHeight - $(this).height();  

							    // Finally, make sure offset aligns with position
							    ui.offset.top = Math.round(ui.position.top + noteboardTop);
							    ui.offset.left = Math.round(ui.position.left + noteboardLeft);

							    self.trigger('resource-drag', evt, ui);
							},
							stop: function(evt, ui){
								self.trigger('resource-stop', evt, ui);
							}
					   })

			// Eventos que no generan cambio en el modelo
			.on('mouseover', function(e) { self.elems.comment.css('display', 'block'); })
			.on('mouseout', function(e) { 
											var qtip = self.elems.comment.attr('aria-describedby');
											
											if ($('#' + qtip).css('display') != 'block' && (!model.data.comments))
        										self.elems.comment.css('display', 'none');
										});

		this.elems.resize
			.on('click', function(){ return false; })
			.draggable({
				start: function(evt, ui) {
					pointerX = (self.elems.template.position().left / self.noteboard.scale) + 5;
					pointerY = (self.elems.template.position().top / self.noteboard.scale) + 5;

					noteboardTop = self.noteboard.target.offset().top;
				    noteboardLeft = self.noteboard.target.offset().left;
				    noteboardHeight = self.noteboard.target.height();
				    noteboardWidth = self.noteboard.target.width();
				},
				drag: function(evt, ui) {

				    // Fix for noteboard.scale
				    ui.position.top = Math.round((evt.pageY - noteboardTop) / self.noteboard.scale - pointerY);
				    ui.position.left = Math.round((evt.pageX - noteboardLeft) / self.noteboard.scale - pointerX);
				    
				    // Check if element is outside noteboard
				    if (ui.position.left < 0) ui.position.left = 0;
				    if (ui.position.left + $(this).width() > noteboardWidth) ui.position.left = noteboardWidth - $(this).width();  
				    if (ui.position.top < 0) ui.position.top = 0;
				    if (ui.position.top + $(this).height() > noteboardHeight) ui.position.top = noteboardHeight - $(this).height();  

				    // Finally, make sure offset aligns with position
				    ui.offset.top = Math.round(ui.position.top + noteboardTop);
				    ui.offset.left = Math.round(ui.position.left + noteboardLeft);

				    self.trigger('resource-dragResize', evt, ui);
				},				
				stop: function(event, ui){ 
											self.trigger('resource-stopResize', event, ui); 
											$(this).css({ 'bottom':'-15px', 'left': 'auto', 'right':'-15px', 'top': 'auto' });
										 }
			})
			.css('position', 'absolute');

		//QTip comments
		if (model.data.comments && model.data.comments > 0)
			this.elems.comment.html('<span>' + model.data.comments + '</span>');
		else
			this.elems.comment.hide();

    	if (!model.data.isNew)
    		this.applyQTip(this.elems.comment, model.data.id);
	}

	

	/**
	 * Modifica el Id del objeto DOM con el id especificado.
	 * 
	 * @param int id Nuevo id para el objeto DOM
	 */
	View.prototype.setId = function( id ) {
		this.elems.template
			.attr('id', 'n-' + id)
			.attr('data-id', id);

		this.applyQTip(this.elems.comment, id);
	}

	/**
	 * Aplica o elimina estilo de recurso seleccionado
	 * 
	 * @param  boolean flag Si es <true>, el estilo es aplicado, de lo contrario, es removido.
	 */
	View.prototype.selectingResource = function(flag) {
		(flag) ? this.elems.template.addClass('selected') : this.elems.template.removeClass('selected');
	}

	/**
	 * Cambia el index (css) del recurso en cuestión
	 * 
	 * @param  int index Nuevo index del elemento en el DOM.
	 */
	View.prototype.changeIndex = function(index) {
		this.elems.template.css('z-index', index);
	}

	/**
	 * Cambia la posición del recurso en cuestión
	 * 
	 * @param int l Valor <left> del elemento principal asociado.
	 * @param int t Valor <top> del elemento principal asociado.
	 */
	View.prototype.setPosition = function(l, t) {
		this.elems.template.css({ 'left': l, 'top': t });
	}

	/**
	 * Cambia el tamaño en el DOM del recurso en cuestión.
	 * 
	 * @param int w Valor <width> del elemento principal asociado.
	 * @param int h Valor <height> del elemento principal asociado.
	 */
	View.prototype.setSize = function(w, h) {
		this.elems.template.css({ 'width': w, 'height': h });
	}

	/**
	 * Elimina del DOM el template del recurso asociado.	 
	 */
	View.prototype.remove = function() {
		this.elems.template.remove();
	}

	/**
	 * Inhabilita o habilita todos las opciones de edición del recurso
	 * 
	 * @param boolean Determina si se habilita o no las opciones de edición del recurso.
	 * @param Object user Objeto de datos de usuario.
	 */
	View.prototype.locked = function(flag, user) {
		if (flag) {
			this.elems.template.draggable('disable');
			this.elems.template.css('cursor', 'inherit');
		} else {
			this.elems.template.draggable('enable');
			this.elems.template.css('cursor', 'move');
		}
	}

	/**
	 * Añade un nuevo comentario en el panel de comentarios del recurso
	 * con los datos asociados.
	 * 
	 * @param Object args Contiene los datos que serán enviados a los démás módulos
 	 *                    Obj-> {noteId, fullname, profileImage, msg}
 	 */
	View.prototype.addComment = function(args) {
		var qtip = this.elems.comment.attr('aria-describedby');
    		
		if (qtip != undefined)
			$('#' + qtip).find('.untCommentBlocks').data('jsp')
						 .getContentPane()
						 .append( views.commentBlock(args));

		this.elems.comment.html('<span>' + model.data.comments + '</span>');
		this.elems.comment.show();
	}

	/**
	 * Permite aplicar QTip al elemento especificado con contenido
	 * dinámica mediante ajax enviando como dato noteId el id 
	 * especificado
	 * 
	 * @param  JQuery comment  Objeto a aplicar qtip
	 * @param  int noteId Id de la nota en cuestión
	 */
	View.prototype.applyQTip = function(comment, noteId) {
		var self = this
			,flag = true;

        comment.qtip({
        	content: {
        		ajax: {
        			url: API + 'Comment/AllComments/' + noteId,
        			type: 'GET',
        			success: function(data, status) {
        				if (flag) { flag = false } else { return };

        				data = self.createQTip(data, noteId);

        				this.set('content.text', data);

        				data.find('.untCommentBlocks').jScrollPane({
				            showArrows: false,
				            maintainPosition: true,
				            stickToBottom: true,
				            autoReinitialise: true
				        });

				        data.find('.untCommentBlocks').data('jsp').scrollToY(10000);
        			}
        		}
        	},
        	show: 'click',
        	hide: 'click',
        	events: {
        		hidden: function(event, api) {
        			comment.css('display', 'none');
        		}
        	},
        	style: {
        		width: 300, 
        		classes: 'ui-tooltip-shadow ui-tooltip-white ' + model.data.fs
        	}
        });
	}


	/**
	 * Script que se debe de ejecutar despues de cargar dinámicamente el contenido
	 * del QTip a través de AJAX
	 *
	 * @param data Datos obtenidos del servidor mediante AJAX
	 * @param int noteId Id de la nota a la que corresponden los comentarios
	 *
	 * @return data
	 *         Objeto JQuery a patir de la transformación de los datos especificados.
	 */
    View.prototype.createQTip = function (data, noteId) {
        var self = this
        	, $divCommentWrapper = $('<div>', {Class: 'untCommentWrapper'})
            , $divCommentBlocks = $('<div>', {Class: 'untCommentBlocks'}).appendTo($divCommentWrapper)
			, $divCommentTA = $( views.commentTA( self.noteboard.user.profileImage ) ).appendTo( $divCommentWrapper );

		data.forEach(function(comment){				
			$divCommentBlocks.append( views.commentBlock(comment) );
		});

        $divCommentTA.find('textarea[name="commentTA"]')
            .placeholder({ text: i18n.writeComment, autoResize: true, maxHeight: '70'})
            .keypress(function(e) {
            	var keyCode = e.keyCode || e.which;

                if (keyCode == 13) {
                	if (e.shiftKey) return;
                	
                    e.preventDefault();
                    var $textarea = $(this);

                    if ($textarea.val() == '' || $textarea.val() == i18n.writeComment)
                        return;

                    var args = {
                   		noteId: noteId,
                   		fullname: self.noteboard.user.fullname,
                   		profileImage: self.noteboard.user.profileImage,
                   		message: $textarea.val()
                   	}

                    model.addComment( args );

                    $textarea.val('').placeholder({text: i18n.writeComment});
                }
            });

        return $divCommentWrapper;
    }

	return View;
}