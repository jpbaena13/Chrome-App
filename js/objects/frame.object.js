/**
 * Objeto tipo "Frame" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Object data Objeto de datos que contiene la información del frame.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
FrameResource.prototype = Object.create(NoteboardResource.prototype);
function FrameResource( data, noteboard ) {
	var self = this;

	NoteboardResource.call(this, data, noteboard);

	// Cambiando de parent
	$('#timeline').append( this.view.elems.template );
	this.view.addTimelinePreview();

	// Escuchando eventos del modelo
	this.model.on('resource-msg', function(name, msg){ self.view.setMsg(msg) });
	noteboard.areas[data.msg - 1] = this;
}

/**
 * @override Sobre escritura de método View.
 */
FrameResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template.addClass('untFrame untMenuFrame ' + model.data.bg);
	view.elems.cell = $('<div>',{ Class: 'untFrameCell'}).appendTo( view.elems.template );
	view.elems.number = $('<div>',{ Class: 'untFrameNumber'}).appendTo( view.elems.cell ).html(model.data.msg);

	view.elems.header.remove();
	view.elems.shadow.remove();

	/**
	 * Elimina del DOM el template del recurso asociado, además 
	 * del previsualizador del timeline
	 */
	View.prototype.remove = function() {
		this.elems.template.remove();
		this.elems.preview.remove();
	}

	/**
	 * Añade un recuadro de preview al timeline
	 */
	View.prototype.addTimelinePreview = function() {
		this.elems.preview = $('<li>', {Class: 'untFrame'}).data('model', model).attr('index', model.data.msg);
		this.elems.previewCell = $('<div>', {Class: 'untFrameCell'}).appendTo( this.elems.preview );
		this.elems.previewNumber = $('<div>', {Class: 'untFrameNumber'}).html( model.data.msg ).appendTo( this.elems.previewCell );
								
		this.elems.preview.on('click', function(){
			model.noteboard.showArea(model);
		});

		var timelinePanel = $('#timelinePanel');
		if (timelinePanel.data('jsp')) {
			timelinePanel.find('ul').append( this.elems.preview );
			timelinePanel.data('jsp').reinitialise();
		}
	}

	/**
	 * Cambia el index tanto del area como el preview desde el timelinePanel
	 *
	 * @param int msg Valor de index del timeline para el recurso.
	 */
	View.prototype.setMsg = function(msg) {
		this.elems.number.html(msg);
		this.elems.previewNumber.html(msg);
		this.elems.preview.insertAfter( $('#timelinePanel ul li:eq(' + (msg-1) + ')') );
	}
	
	return view;
 }