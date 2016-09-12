/**
 * Definición de Objeto Model para todos los recursos de un <noteboard>. 
 * Este objetos hereda el objeto <Observable>, permitiendo implementar 
 * métodos del patrón "observer".
 * 
 * @param Object data Objeto de datos que contiene la información del recurso al que estará con el modelo.
 * @param Module noteboard Módulo que contiene la información del noteboard.
 */
Model.prototype = new Observable();
function Model( data, noteboard ) {
	this.noteboard = noteboard;
	this.data = data || {};

	this.data.bg		= data.bg || 'yellow';
	this.data.c			= data.c  || '000000';
	this.data.comments	= data.comments || 0;
	this.data.creator  	= data.user || this.noteboard.user;
	this.data.fs		= data.fs || '1em';
	this.data.ff		= data.ff || 'paprika';
	this.data.h			= data.h  || 200;
	this.data.id		= data.id || 't' + this.noteboard.autoincrement();
	this.data.index 	= data.index || this.noteboard.maxIndex;
	this.data.isNew 	= (data.isNew != undefined) ? data.isNew : true;
	this.data.l			= data.l  || 0;
	this.data.msg		= data.msg|| '';
	this.data.noteboardId = this.noteboard.id
	this.data.realTime 	= (data.realTime != undefined) ? data.realTime : false;
	this.data.t			= data.t  || 50;
	this.data.w			= data.w  || 200;
	this.data.locked	= false;
	this.data.dragging	= false;

	// Asegura que el recurso quede dentro del noteboard
	this.setPosition(this.data.l, this.data.t);

	// Se agrega al conjunto de modelos del noteboard
	this.noteboard.models.push(this);

	if (!this.data.realTime)
		this.noteboard.sandbox.emit('resource-add', this);
}

/**
 * Modifica el id del recurso en el DOM
 * 
 * @param int id Nuevo Id del recurso.
 */
Model.prototype.setId = function( id ) {
	this.noteboard.sandbox.emit('resource-id', { 'id': this.data.id, 'newId': id });
	
	this.data.id = id;

	this.trigger('resource-id', this.data.id);
	this.noteboard.sandbox.emit('resource-add-socket', this.data);
}

/**
 * Permite determinar si dos modelos son iguales. Dos modelos
 * son iguales cuando su id's es el mismo.
 * 
 * @param  Model model Instancia de modelo a comparar
 * 
 * @return boolean <true> si los objetos son iguales, de lo contrario <false>
 */
Model.prototype.equals = function( model ) {
	return (this.data.id == model.data.id);
}

/**
 * Permite cambiar la posición de un recurso de acuerdo a los parámetros especificados.
 * El cambio verifica que el recurso no quede por fuera de los límites del <noteboard>.
 * 
 * @param int l Valor de la posición <left> del recurso sobre el <noteboard>
 * @param int t Valor de la posición <top> del recurso sobre el <noteboard>
 */
Model.prototype.setPosition = function(l, t) {
	this.data.l = l;
	this.data.t = t;

	if (this.data.l < 0) this.data.l = 0;
	if (this.data.t < 0) this.data.t = 0;

	if ((this.data.l + this.data.w) > this.noteboard.target.width()) {
		this.data.l = this.noteboard.target.width() - this.data.w;
	}

	if ((this.data.t + this.data.h) > this.noteboard.target.height()) {
		this.data.t = this.noteboard.target.height() - this.data.h;
	}

	this.trigger('resource-position', this.data.l, this.data.t);
}

/**
 * Cambia el tamaño del recurso de acuerdo a los parámetros especificados.
 * 
 * @param int w Ancho (width) nuevo del recurso.
 * @param int h Alto (height) nuevo del recruso.
 */
Model.prototype.setSize  = function(w, h) {
	this.data.w = w;
	this.data.h = h;

	this.trigger('resource-resize', w, h);
}

/**
 * Gestiona el evento "drop" del recurso. Este evento de drop es lanzado por jQuery UI.
 * 
 * @param  Event event Evento de drop
 * @param  Object ui    Objeto de datos del evento
 */
Model.prototype.dragging = function(event, ui) {

	var self = this
		,offsetX = ui.position.left - ui.originalPosition.left
		,offsetY = ui.position.top - ui.originalPosition.top;

	self.setPosition(ui.position.left, ui.position.top);
	
	this.noteboard.selectedNotes.forEach(function(model) {
		if (!self.equals(model)) {
			if (!model.originalPosition)
				model.originalPosition = { 'top': model.data.t, 'left': model.data.l };

			model.setPosition(model.originalPosition.left + offsetX, model.originalPosition.top + offsetY);
		}
	});
}

/**
 * Evento lanzado cuando "drop" se detiene.
 * 
 * @param  Event event Evento de stop
 * @param  Object ui    Objeto de datos del evento
 */
Model.prototype.dropping = function(event, ui) {
	var self = this
		,notes = [];

	this.noteboard.selectedNotes.forEach(function(model) {
		if (!self.equals(model)) {
			model.originalPosition = undefined;

			notes.push({
				'id': model.data.id,
				'left': model.data.l,
				'top': model.data.t
			});
		}
	});

	notes.push({
		'id': self.data.id,
		'left': self.data.l,
		'top': self.data.t
	});

	var params = {
		notes: notes,
		noteboardid: this.noteboard.id
	}

	this.noteboard.sandbox.emit('resource-move', params);
}

/**
 * Evento lanzado cuando se está cambiando el tamaño de un recurso mediante
 * el elemento de <resize>
 * 
 * @param  Event event Evento de drop
 * @param  Object ui    Objeto de datos del evento
 */
Model.prototype.draggingResize = function(event, ui) {
	var self = this,
	 	minSize = 80;

	if (ui.position.left < minSize)
		ui.position.left = minSize;

	if (ui.position.top < minSize)
		ui.position.top = minSize;

	var w = ui.position.left + 10
		,h = ui.position.top + 10;

	if (this.data.fs == 'image' || this.data.fs == 'circle')
		h = (this.data.h / this.data.w) * w;

	this.setSize(w, h);

	this.noteboard.selectedNotes.forEach(function(model) {
		if (!self.equals(model) && model.data.fs != 'comment') {
			if (model.data.fs == 'image' || model.data.fs == 'circle')
				h = (model.data.h / model.data.w) * w;

			model.setSize(w, h);
		}
	});
}

/**
 * Evento lanzado cuando "drop" del elemento <resize> se detiene.
 * 
 * @param  Event event Evento de stop
 * @param  Object ui    Objeto de datos del evento
 */
Model.prototype.droppingResize = function(event, ui) {
	var self = this
		,notes = [];

	this.noteboard.selectedNotes.forEach(function(model) {
		if (!self.equals(model)) {
			notes.push({
				'id': model.data.id,
				'width': model.data.w,
				'height': model.data.h
			});
		}
	});

	notes.push({
		'id': self.data.id,
		'width': self.data.w,
		'height': self.data.h
	});

	var params = {
		notes: notes,
		noteboardid: this.noteboard.id
	}

	this.noteboard.sandbox.emit('resource-resize', params);
}

/**
 * Añade o elimina el recurso en cuestión, al arreglo de recursos seleccionados
 * del al módulo "noteboard";
 * 
 * @param  Event e Evento de click sobre el recurso
 */
Model.prototype.selectingResource = function(e) {
	if (this.data.locked) return;
	
	var self = this
		,flag = true;

	if (e.type == 'click' && !e.shiftKey)
		this.noteboard.unselectResources();

	this.noteboard.selectedNotes.forEach(function(note, idx) {
		if (self.equals(note) && e.shiftKey) {
			self.noteboard.selectedNotes.splice(idx, 1);
			flag = false;
			return;
		}
	});

	if (flag) this.noteboard.selectedNotes.push(this);

	this.trigger('resource-selecting', flag);
}

/**
 * Incrementa en una unidad el index (css) del recurso en cuestión.
 *
 * @param Object args Objetos de parámetros
 *                    Obj -> {realTime}
 */
Model.prototype.incrementIndex = function(args) {
	this.noteboard.maxIndex++;
	this.data.index = this.noteboard.maxIndex;

	this.trigger('resource-index', this.data.index);

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-forward', { 'id': this.data.id } );
}

/**
 * Disminuye en una unidad el index (css) del recurso en cuestión.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {realTime}
 */
Model.prototype.decrementIndex = function(args) {
	this.noteboard.minIndex--;
	this.data.index = this.noteboard.minIndex;

	this.trigger('resource-index', this.data.index);

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-back', { 'id': this.data.id } );
}

/**
 * Cambia el mensaje de la nota.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {msg, realTime}
 */
Model.prototype.setMsg = function(args) {
	this.data.msg = args.msg;

	if (args.realTime) {
		this.trigger('resource-msg', this.data.msg);

	} else {
    	this.noteboard.sandbox.emit('resource-msg', { 'id': this.data.id, 'msg': this.data.msg } );
	}
}

/**
 * Cambia el color de la nota.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {bg, realTime}
 */
Model.prototype.setBG = function(args) {
	var self = this
		,notes = [];

	if (!args.realTime)
		this.noteboard.selectedNotes.forEach(function(model) {
			if (!self.equals(model)) {
				model.data.bg = args.bg;
				model.trigger('resource-bg', model.data.bg);

				notes.push({
					'id': model.data.id,
					'bg': model.data.bg
				});
			}
		});

	this.data.bg = args.bg;
	this.trigger('resource-bg', this.data.bg);

	notes.push({
		'id': this.data.id,
		'bg': this.data.bg
	});

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-bg', { notes: notes, noteboardid: this.noteboard.id });
}

/**
 * Cambia el tipo de fuente de la nota.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {ff, realTime}
 */
Model.prototype.setFF = function(args) {
	var self = this
		,notes = [];

	if (!args.realTime)
		this.noteboard.selectedNotes.forEach(function(model) {
			if (!self.equals(model)) {
				model.data.ff = args.ff;
				model.trigger('resource-ff', model.data.ff);

				notes.push({
					'id': model.data.id,
					'ff': model.data.ff
				});
			}
		});

	this.data.ff = args.ff;
	this.trigger('resource-ff', this.data.ff);

	notes.push({
		'id': this.data.id,
		'ff': this.data.ff
	});

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-ff', { notes: notes, noteboardid: this.noteboard.id });
}

/**
 * Cambia el tamaño de la fuente de la nota.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {fs, realTime}
 */
Model.prototype.setFS = function(args) {
	var self = this
		,notes = [];

	if (!args.realTime)
		this.noteboard.selectedNotes.forEach(function(model) {
			if (!self.equals(model)) {
				model.data.fs = args.fs;
				model.trigger('resource-fs', model.data.fs);

				notes.push({
					'id': model.data.id,
					'fs': model.data.fs
				});
			}
		});

	this.data.fs = args.fs;
	this.trigger('resource-fs', this.data.fs);

	notes.push({
		'id': this.data.id,
		'fs': this.data.fs
	});

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-fs', { notes: notes, noteboardid: this.noteboard.id });
}

/**
 * Cambia el color de fuente de la nota.
 * 
 * @param Object args Objetos de parámetros
 *                    Obj -> {c, realTime}
 */
Model.prototype.setC = function(args) {
	var self = this
		,notes = [];

	if (!args.realTime)
		this.noteboard.selectedNotes.forEach(function(model) {
			if (!self.equals(model)) {
				model.data.c = args.c;
				model.trigger('resource-c', model.data.c);

				notes.push({
					'id': model.data.id,
					'c': model.data.c
				});
			}
		});

	this.data.c = args.c;
	this.trigger('resource-c', this.data.c);

	notes.push({
		'id': this.data.id,
		'c': this.data.c
	});

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-c', { notes: notes, noteboardid: this.noteboard.id });
}

/**
 * Elimina el modelo y todo lo relacionado con él, además lo elimina
 * del arreglo de modelos del <noteboard>.
 */
Model.prototype.remove = function(args) {
	var self = this
		,notes = [];

	if (!args.realTime)
		this.noteboard.selectedNotes.forEach(function(model) {
			if (!self.equals(model)) {
				model.trigger('resource-remove');
				notes.push( {'id': model.data.id} );

				// Particularmente para <frame>
				if (model.data.fs == 'frame') {
					var index = model.data.msg-1;
					model.noteboard.areas.splice(index, 1);

					for(var i = index; i < model.noteboard.areas.length; i++) {
						var timelineArea = model.noteboard.areas[i];
						timelineArea.model.data.msg = timelineArea.model.data.msg - 1;
						timelineArea.model.trigger('resource-msg', timelineArea.model.data.msg);
					}
				}

				// Eliminando de arreglo de modelos
				self.noteboard.models.forEach(function(m, index){
					if (model == m) {
						model.data = undefined;
						model._events = undefined;
						self.noteboard.models.splice(index, 1);
					}
				});
			}
		});

	this.trigger('resource-remove');
	notes.push( {'id': this.data.id} );

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-remove', { notes: notes, noteboardid: this.noteboard.id });

	// Particularmente para <frame>
	if (this.data.fs == 'frame') {
		var index = this.data.msg-1;
		this.noteboard.areas.splice(index, 1);

		for(var i = index; i < this.noteboard.areas.length; i++) {
			var timelineArea = this.noteboard.areas[i];
			timelineArea.model.data.msg = timelineArea.model.data.msg - 1;
			timelineArea.model.trigger('resource-msg', timelineArea.model.data.msg);
		}
	}

	// Eliminando de arreglo de modelos
	this.noteboard.models.forEach(function(model, index){
		if (model == self) {
			model.data = undefined;
			model._events = undefined;
			self.noteboard.models.splice(index, 1);
		}
	});	
}

/**
 * Aumenta en una unidad el número de comentarios asociados al recurso.
 *
 * @param Object args Contiene los datos que serán enviados a los démás módulos
 *                    Obj-> {noteId, fullname, profileImage, msg}
 */
Model.prototype.addComment = function( args ) {
	this.data.comments++;

	this.trigger('resource-comment-add', args);

	if (!args.realTime)
		this.noteboard.sandbox.emit('resource-comment-add', args);
}

/**
 * Permite abrir la zona de archivos adjuntos.
 */
Model.prototype.attachZone = function(){
	this.trigger('resource-attach-zone');
	this.noteboard.sandbox.emit('resource-attach-zone');
}

/**
 * Bloquea o desbloquea el recurso al que está asociado el modelo
 *
 * @param boolean flag determina si se bloquea o desbloquea el recurso
 * @param Object user Objeto de datos de usuario
 */
Model.prototype.setLocked = function(flag, user) {
	var self = this;
	this.data.locked = flag;
	this.trigger('resource-locked', flag, user);

	this.noteboard.selectedNotes.forEach(function(model) {
		if (!self.equals(model)) {
			model.trigger('resource-locked', flag);
			model.data.locked = flag;
		}
	});
}


Model.prototype.attach = function() {
	this.noteboard.sandbox.emit('note-attach', {id: this.data.id});
}

/**
 * Cambia el index en el timeline del recurso asociado al modelo.
 * Este valor es almacenado en el campo msg del modelo.
 * 
 * @param Object args Contiene los datos que serán enviados a los démás módulos
 *                    Obj-> {id, index}
 */
Model.prototype.setIndexTimeline = function(args) {
	var min = Math.min(this.data.msg, args.index)
		,max = Math.max(this.data.msg, args.index)
		,timeline = this.noteboard.areas[this.data.msg - 1]
		,resources = [];

	if (this.data.msg > args.index) {
		for(var i = max - 1; i >= min ; i--) {
			var timelineArea = this.noteboard.areas[i-1];
			timelineArea.model.data.msg = timelineArea.model.data.msg + 1;
			timelineArea.model.trigger('resource-msg', timelineArea.model.data.msg);
			this.noteboard.areas[i] = timelineArea;

			resources.push({id: timelineArea.model.data.id, msg: timelineArea.model.data.msg});
		}

	} else {
		for(var i = min + 1; i <= max; i++) {
			var timelineArea = this.noteboard.areas[i-1];
			timelineArea.model.data.msg = timelineArea.model.data.msg - 1;
			timelineArea.model.trigger('resource-msg', timelineArea.model.data.msg);
			this.noteboard.areas[i-2] = timelineArea;

			resources.push({id: timelineArea.model.data.id, msg: timelineArea.model.data.msg});
		}
	}

	this.noteboard.areas[args.index-1] = timeline;
	this.data.msg = args.index;
	this.trigger('resource-msg', this.data.msg);

	resources.push({id: this.data.id, msg: this.data.msg});
    
    if (!args.realTime)
 		this.noteboard.sandbox.emit('resource-index-timeline', { 'id': this.data.id, 'index': args.index , 'resources': resources} );
}
