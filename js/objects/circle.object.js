/**
 * Objeto tipo "Circle" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Objet data Objeto de datos que contiene la información del video.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
CircleResource.prototype = Object.create(NoteboardResource.prototype);
function CircleResource( data, noteboard ) {
	NoteboardResource.call(this, data, noteboard);
}

/**
 * @override Sobre escritura de método View.
 */
CircleResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template
		.addClass('untCircle untMenuCircle ' + model.data.bg)

	view.elems.header.remove();
	view.elems.shadow.remove();
	
	return view;
 }