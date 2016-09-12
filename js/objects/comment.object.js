/**
 * Objeto tipo "Comment" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Objet data Objeto de datos que contiene la información del comentario.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
CommentResource.prototype = Object.create(NoteboardResource.prototype);
function CommentResource( data, noteboard ) {
	NoteboardResource.call(this, data, noteboard);

	noteboard.sandbox.on('noteboard-mousewheel', this.view.zoomResize);
	this.view.zoomResize();
}

/**
 * @override Sobre escritura de método View.
 */
CommentResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template.addClass('untComment untMenuComment ' + model.data.bg).data('bg', model.data.bg);
	view.elems.pin = $('<div>',{ Class: 'untCommentPin'}).prependTo( view.elems.template );

	view.elems.shadow.remove();
	view.elems.resize.remove();

	/**
	 * Cambia el tamaño en el DOM del recurso en cuestión.
	 * 
	 * @param int w Valor <width> del elemento principal asociado.
	 * @param int h Valor <height> del elemento principal asociado.
	 * @override
	 */
	View.prototype.setSize = function(w, h) {
		return false;
	}

	/**
	 * Redimensiona el tamaño del comentario de acuerdo al zoom establecido
	 */
	View.prototype.zoomResize = function() {
		var scale = (1/model.noteboard.scale);

		view.elems.template.css({
			'-webkit-transform' : 'scale(' + scale + ')',
			'-moz-transform' : 'scale(' + scale + ')',
			'transform' : 'scale(' + scale + ')'
		});
	}
	
	return view;
}