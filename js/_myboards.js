/**
 * Javascript página myboards
 *
 * @package     webroot
 * @subpackage  js
 * @author      JpBaena13
 */

var options = $('<div>')
	,navigation = $('#navigation');

$(window).on('resize', function(){
	navigation.data('jsp').reinitialise();
});

/**
 * Realiza llamado al API de unnotes solicitando el esquema de carpetas del nodo
 * principal para el usuario..
 * 
 * @param  JQuery-Object elem Objeto JSON que referencia sub-arbol que se renderizará
 */
var _getFolderScheme = function() {
	options.empty(); //Reset string
	navigation.empty(); // Reset Navigation

	// Obteniendo la estructura de carpetas para el usuario autenticado.
	$.getJSON(
		API + 'Noteboard/FolderScheme/' + navigation.data('folder'),
		function(data) {
			data.name = i18n.branchRoot
			var branchRoot = new Folder(data);
			navigation.append( branchRoot.template() );

			_buildTreeView( branchRoot );

			// Building Tree
			navigation.treeview({
			    animated: "fast",
			    persist: "cookie",
			    cookieId: "treeview-black",
			    collapsed: false,
			    unique: true,
			    toggle: function() {
			    	navigation.data('jsp').reinitialise();
			    }
			});

			if (!navigation.data('jsp'))
				navigation.jScrollPane();

			var hash = location.hash
				,folderId = data.id;
			
			if (/folder/.test(hash))
				folderId = $("a[href='" + hash + "']").addClass('selected').data('folder') || branchRoot.template().find('> a').addClass('selected').data('folder');
			else
				branchRoot.template().find('> a').addClass('selected');

			navigation.css('visibility', 'visible');
			$('#navContainer .untLoader').remove();

			Noteboard.prototype.LoadNoteboards.call( this, folderId );
		}
	);
}

/**
 * Construye todas las ramas perteneciente al <tree> especificado de manera <RECURSIVA>.
 * 
 * @param  NoteboardObject Objeto Noteboard que contiene los datos de <branch> a ser añadido.
 */
var _buildTreeView = function( noteboard ) {
	var tree = noteboard.getSubTree();

	noteboard.model.data.children.forEach(function( child ) {
		var branch = new Folder(child);
		tree.append( branch.template() );

		_buildTreeView( branch );

		// //Construyendo options
		options.append('<option value="' + child.id + '">' + clipText(child.name, 30) + '</option>');
	});
}

// [INIT] inicializando árbol de navegación
_getFolderScheme();


// Crea qtip con opciones de menú
$('#btnCreate').qtip({
	content: {  text: $('#contentMenu') },
	show: { event: 'click' },
	hide: { event: 'unfocus' },
	position: {my: 'top center', at: 'bottom center'},
	style: { classes: 'qtip-create-options'}
});


//Evento para la creación de <noteboards, folders, groups>
$('.untMenuLI').on('click', function() {	
	var $this = $(this)
		,type = $this.data('type')
		,ctype = type.charAt(0).toUpperCase() + type.slice(1)
		,url = ROOT_URL + 'Noteboard/Manager?type=' + type
		,title = eval('i18n.create' + ctype)
		,errName = eval('i18n.errName' + ctype);

	$('#btnCreate').qtip('hide');

	$.untInputWin({
		title: title,
		content: url,
		width: '400',
		btnCancel: true,
		clickAccept: function() {
			if (!$('#noteboardForm').valid())
				return false;

			$.post(
				API + 'Noteboard',
				$('#noteboardForm').serialize(),
				function(noteboard) {

					if (type == 'noteboard') {
						location.href = ROOT_URL + 'Noteboard/App/' + noteboard.url;

					} else {
						var tree = $('#subtree-' + noteboard.parentId).find('> ul')
						,branch = new Folder(noteboard);

						if (tree.length == 0)
							tree = navigation.find('> ul');

						tree.append( branch.template() );
						navigation.treeview({ add:branch.template() });
						navigation.data('jsp').reinitialise();

						//Construyendo options
						options.append('<option value="' + noteboard.id + '">' + clipText(noteboard.name, 30) + '</option>');
					}
				},
				'json'
			);
		},
		onLoadContent: function() {
			var selected = $('#navigation li a.selected')
				,select = $('#slcParent')
				,id = navigation.data('id');
			
			if (selected.length !== 0)
				id = selected.data('folder')

			select.append( options.html() );
			select.find('option[value=' + id + ']').attr('selected', 'selected');
			$('.untWin .untHelper').qtip({ style: {classes: 'qtip-untHelper'} });

			// Validación
			$('#noteboardForm').validate({
			    success: 'valid',
			    rules: { name: { required: true }},
			    messages: { name: { required: '.' }}
			});

			$('#name').focus();
			$('.untCategoryItems').jScrollPane();
		}
	});
});

// Gestión de categorias
$('#btnMngCategory').on('click', function() {
	$('#qtip-3').hide();

	location.hash = 'categories';

	$('.untMainContent').find('.untNoteboard').remove();
	$('.untMainContent').find('.untEmpty').hide();
	$('#noteboardsDesigned').show();

	$.getJSON(
		API + 'Category/AllCategories/',
		function(data) {
			data.forEach(function(category){
				var c = new Category( category );
				$('#container').append( c.template() );
			});
		}
	);
});

// Selección de categoria
$(document).on('click', '.untCategoryItems li', function(){
	$('.selected').removeClass('selected');
	$(this).find('div').addClass('selected');
	$('#categoryId').val( $(this).data('value') );
});

// Menu contextual boards
var trigger = undefined;
$.contextMenu({
    selector: '.untNoteboard',
    items: {
				edit:{name: i18n.editNoteboard, icon: 'pencil'},
				share: 	{name: i18n.shareNoteboard, icon: 'users'},
    		    copy: {name: i18n.copyNoteboard, icon: 'copy'},
    		    sep1: "----------",
    		    delete: {name: i18n.deleteNoteboard, icon: 'remove'},
            },
    build: function($trigger, e) {
    	trigger = $trigger;
    },
    callback: function(key, options) {
    	trigger.find('.' + key).click();
    }
});

// Evitar submit del formulario para noteboard
$(document).on('submit', '#noteboardForm', function(){
	return false;
});