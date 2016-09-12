// -------------
// MODELO
// -------------
CategoryModel.prototype = new Observable();
function CategoryModel( data ) {
	this.data = data || {};

	this.data.id = data.id || undefined;
	this.data.name = data.name || '';
	this.data.creationDate = data.creationDate || undefined;
	this.data.bgBodyColor = data.bgBodyColor || 'CCC';
	this.data.bgImageBoard = data.bgImageBoard || 'silver_new.png';
	this.data.Class = data.Class || null;
	this.data.repeat = data.repeat || 'no-repeat';
	this.data.height = data.height || 2000;
	this.data.width = data.width || 4000;
	this.data.visibility = data.visibility || 'public';
	this.data.creatorId = data.creatorId || undefined;
	this.data.structure = data.structure || [];
}
CategoryModel.prototype.setName = function(name) {
	this.data.name = name;
	this.save();
}
CategoryModel.prototype.setCreationDate = function(creationDate) {
	this.data.creationDate = creationDate;
	this.save();
}
CategoryModel.prototype.setBgBodyColor = function(bgBodyColor) {
	this.data.bgBodyColor = bgBodyColor;
	this.save();
}
CategoryModel.prototype.setBgImageBoard = function(bgImageBoard) {
	this.data.bgImageBoard = bgImageBoard;
	this.save();
}
CategoryModel.prototype.setClass = function(Class) {
	this.data.Class = Class;
	this.save();
}
CategoryModel.prototype.setRepeat = function(repeat) {
	this.data.repeat = repeat;
	this.save();
}
CategoryModel.prototype.setHeight = function(height) {
	this.data.height = height;
	this.save();
}
CategoryModel.prototype.setWidth = function(width) {
	this.data.width = width;
	this.save();
}
CategoryModel.prototype.setCreatorId = function(creatorId) {
	this.data.creatorId = creatorId;
	this.save();
}
CategoryModel.prototype.setVisibility = function(visibility) {	
	this.data.visibility = visibility ? 'public' : 'private';
	this.save();
}
CategoryModel.prototype.setStructure = function(structure) {
	this.data.structure = structure;
}
CategoryModel.prototype.save = function() {
	$.ajax({
			url: API + 'Category/' + this.data.id,
			data: this.data,
			type: 'PUT'
		});
}

// -----------------
// OBJETO CATEGORY
// -----------------
function Category( category ) {
	var self = this;

	category = category || {};

	this.model = new CategoryModel( category );
	this.view = this.View( category );

	this.view.on('category-name', function(e, name){ self.model.setName(name); });
	this.view.on('category-width', function(e, width){ self.model.setWidth(width); });
	this.view.on('category-height', function(e, height){ self.model.setHeight(height); });
	this.view.on('category-repeat', function(e, repeat){ self.model.setRepeat(repeat); });
	this.view.on('category-visibility', function(e, visibility){ self.model.setVisibility(visibility); });
}
Category.prototype.template = function() {
	return this.view.elems.template;
}
Category.prototype.View = function( category ) {
	var self = this;

	View.prototype = new Observable();
	function View() {
		var _this = this
			,repeat = new Array();

        repeat[category.repeat] = 'selected';

		this.elems = {};
		this.elems.template = $('<div>', {Class: 'untContentDesign'}).data('model', category);
		this.elems.preview = $('<span>', {Class: 'preview'}).appendTo(this.elems.template);
		this.elems.upload = $('<div>', {Class: 'upload'}).appendTo(this.elems.preview).html('<span>' + i18n.changeBgImage + '</span>');
		this.elems.imagePreview = $('<img>', { src: WEBROOT_URL + 'img/noteboard/' + category.bgImageBoard, alt: 'Canvas'}).appendTo(this.elems.preview);
		this.elems.info = $('<span>', {Class: 'info'}).appendTo(this.elems.template);
		this.elems.h3 = $('<h3>').appendTo(this.elems.info);
		this.elems.name = $('<input>', {type: 'text', name: 'name', value: category.name}).placeholder({text: i18n.boardName}).appendTo(this.elems.h3);
		this.elems.small = $('<small>').html(category.creationDate).appendTo(this.elems.h3);
		this.elems.width = $('<input>', {type: 'text', name: 'width', value: category.width});
		this.elems.height = $('<input>', {type: 'text', name: 'height', value: category.height});
		this.elems.visibility = $('<input>', {type: 'checkbox', name: 'visibility', checked: (category.visibility == 'public')});
		this.elems.structure = $('<span>', {Class: 'structure'}).append('<h3>' + i18n.structuringBoards + '</h3>');
		this.elems.structureContent = $('<div>', {Class: 'structureContent'}).appendTo(this.elems.structure);
		this.elems.repeat = $('<select>', {name: 'repeat'})
												.append('<option value="repeat"' + repeat['repeat'] + '>repeat</option>')
												.append('<option value="no-repeat"' + repeat['no-repeat'] + '>no-repeat</option>')
												.append('<option value="repeat-x"' + repeat['repeat-x'] + '>repeat-x</option>')
												.append('<option value="repeat-y"' + repeat['repeat-y'] + '>repeat-y</option>')
												.append('<option value="round"' + repeat['round'] + '>round</option>')
												.append('<option value="space"' + repeat['space'] + '>space</option>');

		this.elems.info.append(
								'<table>\
									<tr>\
										<td>' + i18n.width + '</td>\
										<td class="width"></td>\
									</tr>\
									<tr>\
										<td>' + i18n.height + '</td>\
										<td class="height"></td>\
									</tr>\
									<tr>\
										<td>' + i18n.repeat + '</td>\
										<td class="repeat"></td>\
									</tr>\
									<tr>\
										<td>' + i18n.public + '</td>\
										<td class="public"></td>\
									</tr>\
								</table>');

		this.elems.info.find('td.width').append( this.elems.width );
		this.elems.info.find('td.height').append( this.elems.height );
		this.elems.info.find('td.repeat').append( this.elems.repeat);
		this.elems.info.find('td.public').append( this.elems.visibility);

		this.elems.template.append(this.elems.structure);

		// Eventos
		this.elems.name.on('change', function(e){ _this.trigger('category-name', this.value, e); });
		this.elems.width.on('change', function(e){ _this.trigger('category-width', this.value, e); })
						.on('keypress', function(e){ permissionsKeyPress.OnlyIntegersNBSHandled(e); });
		this.elems.height.on('change', function(e){ _this.trigger('category-height', this.value, e); })
						 .on('keypress', function(e){ permissionsKeyPress.OnlyIntegersNBSHandled(e); });
		this.elems.repeat.on('change', function(e){ _this.trigger('category-repeat', this.value, e); });
		this.elems.visibility.on('change', function(e){ _this.trigger('category-visibility', this.checked, e); });

		this.elems.upload.on('click', function(){ _this.uploadBgImage() });

		// Relación previsualizar estructuración de tablero
		var ratio = 200/self.model.data.width
			, l = (200 - (self.model.data.width * ratio) ) / 2
			, t = (200 - (self.model.data.height * ratio) ) / 2
			, bgColor = 333;

		if (self.model.data.width < self.model.data.height)
			ratio = 200/self.model.data.height;

		self.model.data.structure.forEach(function(e) {
			bgColor += 111;
			
			var div = $('<div>', {Class: 'area'}).css({
														'background-color': '#' + bgColor,
														width: e.width * ratio,
														height: e.height * ratio,
														'margin-left': l + e.left * ratio,
														'margin-top': t + e.top * ratio
													});

			_this.elems.structureContent.append(div);
		});

		this.elems.structureTool = $('<div>', {Class: 'upload'}).appendTo(this.elems.structureContent).html('<span>' + i18n.structuring + '</span>');
		this.elems.structureTool.on('click', function(){

			var structure = new Structure(self.model.data);
			
			$.untInputWin({
				title: 'Estructuración de Tablero: ' + self.model.data.name,
				content: structure.template(),
				btnAccept: false
			});
		});

	}

	/**
	 * Permite mostar el panel para subir nueva imagen de fondo
	 */
	View.prototype.uploadBgImage = function() {
		var _this = this;

		$.untInputWin({
			content: views.formBgImage(self.model.data.id),
			classes: 'dropzone',
			width: '100%'
		});

		var dz = new Dropzone("#uploadDropzone", {
			maxFilesize: 0.1,
			maxFiles: 1,
			success: function(file, data, event) {
				var d = new Date();
				_this.elems.imagePreview.attr('src', 'webroot/img/noteboard/' + data.bgImageBoard + '?' + d.getTime());
				untInputWinRemove();
			}
		});

		untInputWinCenter();
	}

	return new View();
}