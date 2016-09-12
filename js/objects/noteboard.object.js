// -------------
// MODELO
// -------------
NoteboardModel.prototype = new Observable();
function NoteboardModel( data ) {
	this.data = data;
	this.data.ctype = data.type.charAt(0).toUpperCase() + data.type.slice(1);

}NoteboardModel.prototype.setName = function(name) {
	this.data.name = name;
	this.trigger('noteboard-name', name);
}
NoteboardModel.prototype.setDescription = function(description) {
	this.data.description = description;
	this.trigger('noteboard-description', description);
}
NoteboardModel.prototype.setVisibility = function(visibility) {
	this.data.visibility = visibility;
	this.trigger('noteboard-visibility', visibility);
}
NoteboardModel.prototype.setParentId = function(parentId) {
	this.data.changeParent = (this.data.parentId != parentId);

	this.data.parentId = parentId;
	this.trigger('noteboard-parentId', parentId);
}
NoteboardModel.prototype.setCategoryId = function(categoryId) {
	this.data.categoryId = categoryId;
}


// -----------------------------
// BASE PARA CUALQUIER NOTEBOARD
// -----------------------------
function NoteboardBase( data ) {
	var self = this;

	this.model = new NoteboardModel( data );
	this.view = this.View( this.model.data );

	// Escuchando eventos de la vista
	this.view.on('noteboard-share', function(){ self.Share() });
	this.view.on('noteboard-edit', function(){ self.Edit() });
	this.view.on('noteboard-delete', function(){ self.Delete() });

	// Escuchando eventos del modelo
	this.model.on('noteboard-name', function(e, name){ self.view.setName(name) });
	this.model.on('noteboard-description', function(e, description){ self.view.setDescription(description) });
	this.model.on('noteboard-visibility', function(e, visibility){ self.view.setVisibility(visibility) });
	this.model.on('noteboard-parentId', function(e, parentId){ self.view.setParentId(parentId) });
}
NoteboardBase.prototype.Share = function() {
	var self = this;

	$.untInputWin({
		title: eval('i18n.share' + this.model.data.ctype),
		content: ROOT_URL + 'Noteboard/ShareManager/' + this.model.data.id,
		clickAccept: function() {
			
			var serialize = $('#frmNoteboardShare').serialize();

			if ($.trim(serialize) == '') {
				$('#frmNoteboardShare .untPlgMsg').untInputMsg({
					content: i18n.errSelectCollaborator,
					type: 'Err'
				}).show();

				return false;
			}

			// TODO: Deshabilitando boton ventana modal
			$('.btnWinAccept').attr('disabled', 'true').removeClass('yellow');

			$.post(
				ROOT_URL + 'Noteboard/Share/' + self.model.data.id,
				$('#frmNoteboardShare').serialize(),
				function() {
					untInputWinRemove();
				}
			);

			return false;
		},
		onLoadContent: function() {
			$('#frmNoteboardShare').on('submit', function(){ return false; });
			$('.untWin .btnWinAccept').html(i18n.sendInvitation);
			$('.untWin .btnWinCancel').html(i18n.closeWindow);

			$('#contact')
				.on('keypress', function(){
					$('.untPlgMsg').html('');
				})
				.autocomplete({
					source: function(request, response) {
						$.getJSON(
							API + 'User/Search/?term=' + request.term + '&noteboardId=' + self.model.data.id,
							function(data) {
								response(data);
							}
						);
					},
					select : function(event, ui) {
						var $user = $('<div>',{Class: 'untShareUser'}).appendTo( $('#collaborators') )
							, $profileImage = $('<div>', {Class : 'untInline'}).append('<img src="' + ui.item.label.profileImage + '" width="35px">').appendTo($user)
							, $profile = $('<div>', {Class: 'profile untInline'}).appendTo($user)
							, $name = $('<div>', {Class: 'name'}).html(ui.item.label.fullname).appendTo($profile)
							, $email = $('<div>', {Class: 'email'}).html(ui.item.label.email).appendTo($profile)
							// , $btnPerm = $('<div>', {Class: 'permissions icon-cog'}).prependTo($user)
							, $btnDel = $('<div>', {Class: 'delete icon-cancel-circle'}).prependTo($user).on('click', function(){ $user.remove(); })
							, $input = $('<input>', {type: 'hidden', name: 'collaborators[]', value: ui.item.value}).appendTo($user);

						$(this).val('').focus();
						return false;
					},
					minLength: 3
				})
				.data('ui-autocomplete')._renderItem = function(ul, item) {
					var exit = false;
					$('#collaborators').find('[value]').each(function(){ if (this.value == item.value) exit = true; });

					if (exit)
						return $('').data('ui-autocomplete-item', item);

					var $user = $('<a>',{Class: 'untShareUser'})
						, $profileImage = $('<div>', {Class : 'untInline'}).append('<img src="' + item.label.profileImage + '" width="35px">').appendTo($user)
						, $profile = $('<div>', {Class: 'profile untInline'}).appendTo($user)
						, $name = $('<div>', {Class: 'name'}).html(item.label.fullname).appendTo($profile)
						, $email = $('<div>', {Class: 'email'}).html(item.label.email).appendTo($profile);

					return $("<li>")
							.data('ui-autocomplete-item', item)
							.append( $user )
							.appendTo(ul);
				};


			// Eliminar usuario compartido desde ventana "Compartir Tablero"
			$('#collaboratorsContainer .delete').on('click', function(){
			    var $this = $(this);
    
			    $.untInputWin({
			        title: i18n.deleteCollaborator,
			        content: i18n.deleteCollaboratorMsg,
			        btnCancel: true,
			        width: '300',
			        clickAccept: function() {           
			            $.ajax({
			                url: API + 'Noteboard/Unshare/' + $this.data('id'),
			                data: { 'userId' : $this.data('userid') },
			                type: 'POST',
			                dataType: 'json',
			                success: function(data) {
			                    $this.parent().remove();
			                },
			            });
			        }
			    });
			});

			// Cambiando permisos de colaborador
			$('#collaboratorsContainer .permissions').on('click', function(){
			    var $this = $(this)
			        ,userId = $this.data('userid')
			        ,permissions = {
			                            'noteboardId': $this.attr('data-id'),
			                            'canEdit': $this.attr('data-canedit'),
			                            'canComment': $this.attr('data-cancomment'),
			                            'canDelete': $this.attr('data-candelete'),
			                            'canUploadFiles': $this.attr('data-canuploadfiles'),
			                            'canDeleteAttach': $this.attr('data-candeleteattach'),
			                            'canInvite': $this.attr('data-caninvite'),
			                        };

			    $.untInputWin({
			        title: i18n.userPermissions,
			        content: views.permissionsForm( permissions ),
			        clickAccept: function() {
			            
			            $.ajax({
			                url: ROOT_URL + 'User/Permissions/' + userId,
			                data: $('#permissionsForm').serialize(),
			                type: 'POST',
			                dataType: 'json',
			                success: function(data) {
			                    $this.attr('data-canedit', data.canEdit);
			                    $this.attr('data-cancomment', data.canComment);
			                    $this.attr('data-candelete', data.canDelete);
			                    $this.attr('data-canuploadfiles', data.canUploadFiles);
			                    $this.attr('data-candeleteattach', data.canDeleteAttach);
			                    $this.attr('data-caninvite', data.canInvite);
			                    untInputWinRemove();
			                }
			            });

			            return false;
			        }
			    })
			});
		}
	});
}
NoteboardBase.prototype.Delete = function() {
	var self = this,
		content = eval('i18n.delete' + this.model.data.ctype + 'Msg');

	if (!this.model.data.user.owner)
		content = eval('i18n.unshare' + this.model.data.ctype + 'Msg');

	$.untInputWin({
		title: eval('i18n.delete' + this.model.data.ctype),
		content: content,
		maxWidth: '300px',
		clickAccept: function() {
			$.ajax({
				url: API + 'Noteboard/' + self.model.data.id,
				type: 'DELETE',
				dataType: 'json',
				success: function(data) {
					if (self.model.data.type == 'noteboard') {
						self.template().remove();
					} else {
						location.hash = '';
						_getFolderScheme();
					}
				}
			});

			untInputWinRemove();
		}
	});	
}
NoteboardBase.prototype.Edit = function() {
	var self = this;

	$.untInputWin({
		title: eval('i18n.edit' + this.model.data.ctype),
		content: ROOT_URL + 'Noteboard/Manager/' + this.model.data.id + '?type=' + this.model.data.type,
		width: '400',
		clickAccept: function() {
			if (!$('#noteboardForm').valid())
				return false;
			
			$.ajax({
				url: API + 'Noteboard/' + self.model.data.id,
				type: 'PUT',
				dataType: 'json',
				data: $('#noteboardForm').serialize(),
				success: function(data) {
					self.model.setName( data.name );
					self.model.setDescription( data.description );
					self.model.setVisibility( data.visibility );
					self.model.setParentId( data.parentId );
					self.model.setCategoryId( data.categoryId );
					untInputWinRemove();
				}
			});

			return false;
		},
		onLoadContent: function() {
			var select = $('#slcParent');
			
			select.append(options.html());
			select.find('option[value=' + self.model.data.parentId + ']').attr('selected', 'selected');
			select.find('option[value=' + self.model.data.id + ']').remove();

			if (self.RemoveChildrenOption) self.RemoveChildrenOption(self.model.data.children, select);
			$('.untWin .untHelper').qtip({ style: {classes: 'qtip-untHelper'} });

			// Validación
			$('#noteboardForm').validate({
			    success: 'valid',
			    rules: {
			        name: {
			            required: true,
			        }
			    },
			    messages: {
			        name: {
			            required: eval('i18n.errName' + self.model.data.ctype),
			        }
			    }
			});

			if (self.model.data.type == 'noteboard')
				$('.untCategoryItems').jScrollPane().data('jsp').scrollToX((self.model.data.categoryId - 1) * 80);

		}
	});
}
NoteboardBase.prototype.template = function() {
	return this.view.elems.template;
}


// -------------------------
// OBJETO NOTEBOARD
// -------------------------
Noteboard.prototype = Object.create(NoteboardBase.prototype)
function Noteboard( noteboard, noUpdate ) {
	NoteboardBase.call(this, noteboard);

	if (!noUpdate)
		this.UpdateThumbails();
}
Noteboard.prototype.View = function( noteboard ) {
	var self = this;

	View.prototype = new Observable();
	function View() {
		var _this = this;

		this.elems = {};
		this.elems.template 	= $('<div>', {Class: 'untNoteboard'}).draggable({ revert: true, opacity: 0.5, helper: 'clone'}).data('model', self.model);

		this.elems.options 		= $('<div>', {Class: 'options untInline'}).appendTo(this.elems.template);
		this.elems.edit 		= $('<div>', {Class: 'edit icon-pencil', title: i18n.edit}).appendTo(this.elems.options).qtip();
		this.elems.share 		= $('<div>', {Class: 'share icon-users', title: i18n.share}).appendTo(this.elems.options).qtip();
		this.elems.delete 		= $('<div>', {Class: 'delete icon-remove', title: i18n.delete}).appendTo(this.elems.options).qtip();

		this.elems.leftContent 	= $('<div>', {Class: 'leftContent'}).appendTo(this.elems.template);
		this.elems.preview 		= $('<a>', 	 {Class: 'preview untInline', href: ROOT_URL + 'Noteboard/App/' + noteboard.url}).appendTo(this.elems.leftContent);
		this.elems.previewImage = $('<img>', {Class: 'previewImage', width: '158px', height: '115px', src: BLOB_IMAGES + 'preview_' + noteboard.url + '.jpg?cache=' + noteboard.cache}).appendTo(this.elems.preview);
		this.elems.profileImage = $('<img>', {Class: 'profileImage', width: '30px', height: '30px', src: noteboard.user.profileImage, title: i18n.createBy + noteboard.user.fullname}).appendTo(this.elems.preview).qtip();

		this.elems.name 		= $('<div>', {Class: 'name'}).html(noteboard.name).appendTo(this.elems.leftContent);
		this.elems.description 	= $('<div>', {Class: 'description'}).html(noteboard.description).appendTo(this.elems.leftContent);

		this.elems.private 		= $('<div>', {Class: 'private icon-lock', title: i18n.private}).appendTo(this.elems.template).qtip();
		this.elems.public 		= $('<div>', {Class: 'public icon-unlocked', title: i18n.public}).appendTo(this.elems.template).qtip();

		// Delegación de click's compartidos por los diferentes tipos
		this.elems.share.on('click', function() { _this.trigger('noteboard-share'); return false; });
		this.elems.delete.on('click', function() { _this.trigger('noteboard-delete'); return false; });
		this.elems.edit.on('click', function() { _this.trigger('noteboard-edit'); return false; });

		this.setVisibility(noteboard.visibility);
	}
	View.prototype.setName = function(name) {
		this.elems.name.html(name)
	}
	View.prototype.setDescription = function(description) {
		this.elems.description.html(description)
	}
	View.prototype.setVisibility = function(visibility) {
		switch( visibility ) {
			case 'private':
				this.elems.private.show();
				this.elems.public.hide();
				break;

			case 'public':
				this.elems.public.show();
				this.elems.private.hide();
				break;
		}
	}
	View.prototype.setParentId = function() {
		if (self.model.data.changeParent) {
			this.elems.template.remove();
		}
	}
	View.prototype.ChangingThumbails = function() {
		this.elems.previewImage.css('opacity', '0.3');
		this.elems.preview.prepend('<img src="' + WEBROOT_URL + 
				'img/default/loader.gif" alt="Loader" class="untLoader" width="30px" height="30px">');
	}
	View.prototype.setThumbails = function(data) {
			this.elems.previewImage.attr('src', BLOB_IMAGES + 'preview_' + noteboard.url + '.jpg?cache=' + data.cache);
			this.elems.preview.find('.untLoader').remove();
			this.elems.previewImage.css('opacity', '1');
	}

	return new View();
}
Noteboard.prototype.UpdateThumbails = function() {
	var self = this;

	if (this.model.data.modified) {
		this.view.ChangingThumbails();		

		$.getJSON(
			'Noteboard/PreviewRefresh/' + this.model.data.url,
			function(data) {
				setTimeout(function(){
					self.view.setThumbails(data);
				},2000);
			}
		);
	}
}
Noteboard.prototype.LoadNoteboards = function( parentId ) {
	$('.untNoteboard').remove();
	$('.untMainContent').find('.untLoader').show();
	$('.untMainContent').find('.untEmpty').hide();

	$.getJSON(
		API + 'Noteboard/Children/' + parentId,
		function(data) {
			$('#btnAddNoteboard').show();

			if (data.length) {
				data.forEach(function(noteboard) {
					var nb = new Noteboard(noteboard);
					$('.untMainContent').append( nb.template() );
				});
			} else {
				$('.untMainContent').find('.untEmpty').show();
			}
			
			$('.untMainContent').find('.untLoader').hide();
		}
	);
}



// -------------------------
// FOLDER OBJECT
// -------------------------
Folder.prototype = Object.create(NoteboardBase.prototype);
function Folder( folder ) {
	var self = this;

	NoteboardBase.call(this, folder);
	this.view.on('branch-clicked', function(){ self.BranchClicked() });
}
Folder.prototype.View = function( noteboard ) {
	var self = this;

	View.prototype = new Observable();
	function View() {
		var _this = this;

		this.elems = {};		
		this.elems.template  = $('<li>', {id: 'subtree-' + noteboard.id}).draggable({ revert: true, opacity: 0.5, helper: 'clone'}).data('model', self.model);
		this.elems.link		 = $('<a>', {href: '#!/folder/' + noteboard.id, Class: 'unt' + noteboard.ctype + ' ' + noteboard.type })
										.data('folder', noteboard.id).appendTo(this.elems.template)
										.attr('data-a', 'a')
										.droppable({
											hoverClass: "ui-state-hover",
											tolerance: 'pointer',
											drop: this.changeParent
										});
		this.elems.icon		 = $('<span>', {Class: 'icon- ' + noteboard.type}).appendTo(this.elems.link);
		this.elems.name		 = $('<span>', {Class: 'name'}).html(noteboard.name).appendTo(this.elems.link);
		this.elems.edit		 = $('<span>', {Class: 'edit icon-cog'}).appendTo(this.elems.link);
		this.elems.share	 = $('<span>', {Class: 'share icon-users'}).appendTo(this.elems.link);
		this.elems.delete 	 = $('<span>', {Class: 'delete icon-remove'}).appendTo(this.elems.link);
		this.elems.ul 		 = $('<ul>').appendTo(this.elems.template);

		// Delegación de click's
		this.elems.share.on('click', function() { _this.trigger('noteboard-share'); return false; });
		this.elems.delete.on('click', function() { _this.trigger('noteboard-delete'); return false; });
		this.elems.edit.on('click', function() { _this.trigger('noteboard-edit'); return false; });
		this.elems.link.on('click', function() { _this.trigger('branch-clicked') });
	}
	View.prototype.setName = function(name) {
		this.elems.name.html(name)
		options.find('option[value=' + self.model.data.id + ']').html(name);
	}
	View.prototype.setDescription = function(description) {}
	View.prototype.setVisibility = function(visibility) {}
	View.prototype.setParentId = function(parentId) {
		if (self.model.data.changeParent) {
			_getFolderScheme();
		}
	}
	View.prototype.changeParent = function(evt, ui) {
		var model = ui.draggable.data('model');

		if (self.model.data.id == model.data.parentId) return;
		
		if(model.data.type == 'group') {
			$.untInputWin({ title: i18n.invalidMovement, content: i18n.invalidMovementMsg })
			return;
		}

		model.data.parentId = self.model.data.id; //Cambiando Padre

		$.ajax({
			url: API + 'Noteboard/' + model.data.id,
			data: model.data,
			type: 'PUT',
			dataType: 'json',
			success: function(data) {
				if (model.data.type == 'folder')
					_getFolderScheme();
				else
					ui.draggable.remove();
			}
		})
	}
	
	return new View();
}
Folder.prototype.BranchClicked = function() {
	$('.selected').removeClass('selected');
	this.view.elems.link.addClass('selected');

	if ( this.template().hasClass('expandable') )
		this.template().find('> .hitarea').click();

	// TODO: Modificando elemento externo
	$('#noteboardsDesigned').hide();

	Noteboard.prototype.LoadNoteboards.call( this, this.model.data.id );
}
Folder.prototype.RemoveChildrenOption = function(children, select) {
	var self = this;

	if (children)
		for (var i = children.length - 1; i >= 0; i--) {
			self.RemoveChildrenOption( children[i].children, select);
			select.find('option[value=' + children[i].id + ']').remove();
		}	
}
Folder.prototype.getSubTree = function() {
	return this.view.elems.ul;
}