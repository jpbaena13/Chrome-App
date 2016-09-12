/**
 * Objeto tipo "Image" que será usado como recurso del <noteboard>. Este objeto
 * hereda del tipo base NoteboardResource
 * 
 * @param Objet data Objeto de datos que contiene la información de la imagen.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
ImageResource.prototype = Object.create(NoteboardResource.prototype);
function ImageResource( data, noteboard ) {
	NoteboardResource.call(this, data, noteboard);
}

/**
 * @override Sobre escritura de método View.
 */
ImageResource.prototype.View = function() {
	var self = this
		, model = this.model
		, View = NoteboardResource.prototype.View.call( this, model )
		, view = new View();

	view.elems.template
		.addClass('untImage untMenuImage')
		.css('background-image', 'url(' + CDN_IMAGES + model.data.msg + ')')
		.data('imageName', model.data.msg)
		.on('click', function(e){
    		if (e.ctrlKey) {
    			$.untInputWin('<img class="untWinImage" src="' + CDN_IMAGES + model.data.msg + '">');
    		}
    	});

	view.elems.shadow.remove();	
	
	return view;
 }