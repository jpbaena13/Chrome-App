/**
 * Objeto tipo "Video" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Objet data Objeto de datos que contiene la información del video.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
VideoResource.prototype = Object.create(NoteboardResource.prototype);
function VideoResource( data, noteboard ) {
	NoteboardResource.call(this, data, noteboard);
}

/**
 * @override Sobre escritura de método View.
 */
VideoResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template
		.addClass('untVideo untMenuVideo')
		.append('<iframe src="' + model.data.msg + '" width="95%" height="85%" allowfullscreen></iframe>');
	
	return view;
 }