// ---------------------
// OBJETO STRUCTURETOOL
// ---------------------
function Structure( category ) {
	var self = this;
	this.view = this.View( category );
}
Structure.prototype.template = function() {
	return this.view.elems.template;
}
Structure.prototype.View = function( category ) {
	var self = this
		,scale = 1200/category.width
		,left
		,top;

	function View() {
		var _this = this;

		this.elems = {};
		this.elems.template = $('<div>', {Class: 'untStructureTool'});
		this.elems.template.css({
									background: 'url(webroot/img/noteboard/' + category.bgImageBoard + ')',
									'background-size': 'contain',
									width: category.width * scale,
									height: category.height * scale
								})
							.selectable({
								start: function(evt) {
									var $this = $(this);
									left = (evt.pageX - ($this.parent().offset().left + 10)) / scale;
									top =  (evt.pageY - ($this.parent().offset().top + 10)) / scale;
								},
								stop: function(evt) {
									var $this = $(this)
										,x = (evt.pageX - ($this.parent().offset().left + 10)) / scale
										,y = (evt.pageY -($this.parent().offset().top + 10)) / scale;
									
									var width =  Math.abs(left - x)
										,height =  Math.abs(top - y)
										,l = Math.min(x, left)
										,t = Math.min(y, top);									

									if (width > 10 && height > 10) {
										var code = generatePass()
											,structure = {
												name: '',
												code: code,
												height: height,
												left: l,
												top: t,
												width: width,
												categoryId: category.id
											};

										$.ajax({
											url: API + 'Structure',
											data: structure,
											type: 'POST',
											success: function(data) {
												_this.Area(data);
											}
										});
									}
								}
							});

		category.structure.forEach(function(e){
			_this.Area(e);
		});

    }
    View.prototype.Area = function( structure ) {
		var _this = this
			,area = $('<div>', {Class: 'Area'}).appendTo( this.elems.template )
 			,btnRemove = $('<div>', {Class: 'icon-cancel-circle'}).appendTo(area)
 			,resize   = $('<div>', {Class: 'resize'}).appendTo( area )
 			,name = $('<input>', {type: 'text', Class: 'name', value: structure.name, 'maxlength': 45}).placeholder({text: i18n.name}).appendTo(area)
 			,code = $('<input>', {type: 'text', Class: 'code', value: structure.code, 'maxlength': 45})
 									.placeholder({text: i18n.code})
 									.appendTo(area)
 									.on('keypress', permissionsKeyPress.OnlyAlphanumericHandledNBS);
 		
 		// Configurando Template
 		area.css({
				height: structure.height * scale,
				left: (structure.left * scale) + 'px',
				position: 'absolute',
				top: (structure.top * scale) + 'px',
				width: structure.width * scale
			})
			.draggable({ 
						containment: 'parent',
						stop: function(evt, ui) {
							structure.left = ui.position.left / scale;
							structure.top = ui.position.top / scale;							

							$.ajax({
								url: API + 'Structure/' + structure.code,
								data: structure,
								type: 'PUT'
							});
						}
					});
			

		// Configurando Resize
		resize.draggable({
				drag: function(evt, ui) {
					if (ui.position.left < 80)
						ui.position.left = 80;

					if (ui.position.top < 80)
						ui.position.top = 80;

					var w = ui.position.left + 10
						,h = ui.position.top + 10;

					area.css({ width: w, height: h });
				},
				stop: function(evt, ui) { 
					structure.width = area.width() / scale;
					structure.height = area.height() / scale;

					$.ajax({
						url: API + 'Structure/' + structure.code,
						data: structure,
						type: 'PUT'
					});
				}
			}).css('position', 'absolute');

		// Cambiando Nombre
		name.on('change', function(e){
			structure.name = this.value;

			$.ajax({
				url: API + 'Structure/' + structure.code,
				data: structure,
				type: 'PUT'
			});
		});

		// Cambiando Código
		code.on('change', function(e){
			var code = structure.code;
			structure.code = this.value;

			if (structure.code == '') {
				$.untInputWin({
					title: i18n.codeEmpty,
					content: i18n.codeEmptyMsg
				});

				this.value = code;
				return;
			}

			$.ajax({
				url: API + 'Structure/' + code,
				data: structure,
				type: 'PUT'
			});
		});

		btnRemove.on('click', function() {
			$.ajax({
				url: API + 'Structure/' + structure.code,
				data: structure,
				type: 'DELETE',
				success: function() {
					area.remove();
				}
			});
		});
    }

    return new View();
}