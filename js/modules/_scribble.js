/**
 * Módulo para el manejo de la escritura a mano alzada.
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.modules
 * @author      JpBaena13
 */
define(
	[
		WEBROOT_URL + 'js/modules/noteboard.js',
		WEBROOT_URL + 'js/core/sandbox.js'
	],
	function(noteboard, sandbox) {

		var $this = undefined;
		
		/**
		 * Función de inicio de módulo
		 */
		var _init = function(args) {
			noteboard.scribble = false;

			$this = this;
			$this.sandbox = new sandbox($this);

			$this.sandbox.on('scribble-add', _scribbleAdd);
			$this.sandbox.on('scribble-clear', _scribbleClear);
			$this.sandbox.on('scribble-load', _scribbleLoad);

			// Eventos de la barra de herramientas del tablero
			$this.sandbox.on('noteboardTool-eraser-dbclick', _scribbleClear);
			$this.sandbox.on('noteboardTool-pencil', _pencilSelected);
			$this.sandbox.on('noteboardTool-eraser', _eraserSelected);
			$this.sandbox.on('noteboardTool-color-change', _colorChange);

			$this.scribble = $('<canvas>').appendTo( noteboard.target ).untScribble();

				
		}

		/**
		 * Añade las coordenadas especificadas al canvas de escritura libre
		 *
		 * @param  Array data Arreglos de coordenadas a pintar en el canvas
		 *               data -> Object { path: [ {x:_x, y:_y} ,{..}..] }
		 */
		var _scribbleAdd = function(data) {
			if (data.realTime)
				$this.scribble.data('scribble').add(data);
		}

		/**
		 * Limpia el canvas una vez es notificado por el servidor de tiempo ral
		 *
		 * @param  Array data Arreglos de coordenadas a pintar en el canvas
		 *               data -> Object { action }
		 */
		var _scribbleClear = function(data) {
			if (data == undefined || data.realTime)
				$this.scribble.data('scribble').clear();

			if (!data)
				$this.sandbox.emit('scribble-clear', {});
		}

		/**
		 * Pinta los datos recibidos en data sobre el canvas
		 * 
		 * @param  Array data Arreglo de Scribble a ser pintados sobre el canvas
		 */
		var _scribbleLoad = function(data) {
			data.forEach(function(scribble){
				$this.scribble.data('scribble').add(scribble);
			});
		}

		/**
		 * Evento generado cuando la herramienta de pincel es seleccionado
		 */
		var _pencilSelected = function() {
			var color = $('.button.color').find('.selected').css('background-color');
			$this.scribble.data('scribble').update({brushColor: color, brush: BasicBrush, brushSize: 5});
			noteboard.scribble = true;
		}

		/**
		 * Evento generado cuando la herramienta de borrador es seleccionada
		 * @return {[type]} [description]
		 */
		var _eraserSelected = function(){ 
			$this.scribble.data('scribble').update({brushColor: 'eraser', brush: EraserBrush, brushSize: 40});
			noteboard.scribble = true; 
		}

		/**
		 * Evento generado cuando el color de pincel ha sido cambiado.
		 * 
		 * @param  string color Nuevo color seleccionado
		 */
		var _colorChange = function(color){
			$this.scribble.data('scribble').update({brushColor: color});
			$('.button.color').find('.selected').css('background-color', color);
		}


		// ****************************************************************************************************
		// **	SCRIBBLE
		// ****************************************************************************************************

		/**
		 * Objeto base para para la creación de <brushs>
		 */
		function BaseBrush() {};
		BaseBrush.prototype = {
			_init: function(context, brushSize, brushColor) {
				this.context = context;
				this.context.globalCompositeOperation = 'source-over';
				this.brushSize = brushSize;
				this.brushColor = brushColor;
				this.draw = false;
				this.active = false;
				this.path = [];
				this.realTime = false;
			},
			strokeBegin: function() {
				if (!noteboard.scribble) return;

				this.active = true;
				this.context.beginPath();
				this.context.lineWidth = this.brushSize;
			},
			strokeMove: function() {
				this.draw = this.active;
			},
			strokeEnd: function() {
				this.active = false;

				if (this.realTime) { 
					this.realTime = false; 
					this.path = [];
				} else {
					var args = {
						brushSize: this.brushSize,
						brushColor: this.brushColor,
						path: JSON.stringify(this.path),
						noteboardId: noteboard.id
					}

					this.path = [];

					$this.sandbox.emit('scribble-add', args)
				}
				
				if (this.draw) {
					this.draw = false;
					return true;
				}
				return false;
			}
		}

		/**
		 * Brush mas básico.
		 */
		BasicBrush.prototype = new BaseBrush;
		function BasicBrush() {
			BasicBrush.prototype.strokeBegin = function(x, y) {
				BaseBrush.prototype.strokeBegin.call(this);
				this.prevX = x;
				this.prevY = y;

				this.path.push({x: x, y: y});
			};
			BasicBrush.prototype.strokeMove = function(x, y){
				BaseBrush.prototype.strokeMove.call(this);

				this.context.moveTo(this.prevX, this.prevY);
				this.context.lineTo(x, y);

				this.context.strokeStyle = this.brushColor;
				this.context.stroke();

				this.prevX = x;
				this.prevY = y;

				this.path.push({x: x, y: y});
			};
		}

		/**
		 * Brush para borrar
		 */
		EraserBrush.prototype = new BaseBrush;
		function EraserBrush() {
			EraserBrush.prototype.strokeBegin = function(x, y) {
				BaseBrush.prototype.strokeBegin.call(this);
				this.prevX = x;
				this.prevY = y;

				this.path.push({x: x, y: y});
			};
			EraserBrush.prototype.strokeMove = function(x, y) {
				BaseBrush.prototype.strokeMove.call(this);

				this.context.moveTo(this.prevX, this.prevY);
				this.context.clearRect(x, y, this.brushSize, this.brushSize);
				this.context.stroke();

				this.prevX = x;
				this.prevY = y;

				this.path.push({x: x, y: y});
			};
		}

		// JQuery Plugin
		(function($){

			var settings = {
				width: 				300,
				height: 			250,
				backgroundColor: 	'transparent',
				backgroundImage:	false,
				backgroundImageX: 	0,
				backgroundImageY: 	0,
				saveMimeType: 		'image/png',
				brush: 				BasicBrush,
				brushSize: 			5,
				brushColor: 		'rgb(0,0,0)',
				fillOnClear: 		true,
				initContent: 		[]
			};

			/**
			 * Scribble Object.
			 * 
			 * @param  JQuery-Obj elem    Elemento aosicado al untScribble.
			 * @param  Object options Objeto de opción (configuración).
			 */
			var untScribble = function(elem, options) {
				var $elem = $(elem)
					,self = this
					,noparent = $elem.is('canvas')
					,canvas = noparent ? $elem[0] : document.createElement('canvas')
					,context = canvas.getContext('2d')
					,width = $elem.innerWidth()
					,height = $elem.innerHeight();

				$.extend(settings, options);

				if (noparent) {
					width = $elem.parent().width();
					height = $elem.parent().height();
				} else {
					$elem.append(canvas);
				}

				if (width < 2) width = settings.width;
				if (height < 2) height = settings.height;

				self.blank = true;
				self.canvas = canvas;
				self.canvas.width = width;
				self.canvas.height = height;
				self.clear();

				self.brush = new settings.brush();
				self.brush._init(context, settings.brushSize, settings.brushColor);

				if (self.brush.strokeBegin && self.brush.strokeMove && self.brush.strokeEnd) {

					canvas.addEventListener('touchstart', function(e){
						e.preventDefault();

						if (e.touches.length > 0) {
							var _x = (e.touches[0].pageX - $elem.offset().left) / noteboard.scale
								,_y = (e.touches[0].pageY - $elem.offset().top) / noteboard.scale;

							self.brush.strokeBegin(_x, _y);
						}
					}, false);

					canvas.addEventListener('touchmove', function(e){
						e.preventDefault();

						if (e.touches.length > 0 && self.brush.active) {
							var _x = (e.touches[0].pageX - $elem.offset().left) / noteboard.scale
								,_y = (e.touches[0].pageY - $elem.offset().top) / noteboard.scale;

							self.brush.strokeMove(_x, _y);
						}
					}, false);

					canvas.addEventListener('touchend', function(e){
						e.preventDefault();

						if (e.touches.length == 0) {
							self.blank = !self.brush.strokeEnd() && self.blank;
						}

					}, false);

					$(canvas)
						.on('mousedown', function(e){
							var _x = (e.pageX - $elem.offset().left) / noteboard.scale
								,_y = (e.pageY - $elem.offset().top) / noteboard.scale;

							self.brush.strokeBegin(_x, _y);
						})
						.on('mousemove', function(e){
							if (self.brush.active) {
								var _x = (e.pageX - $elem.offset().left) / noteboard.scale
									,_y = (e.pageY - $elem.offset().top) / noteboard.scale;

								self.brush.strokeMove(_x, _y);
							}
						})
						.on('mouseup', function(){
							if (self.brush.active) {
								self.blank = !self.brush.strokeEnd() && self.blank;
							}
						})
						.on('mouseout', function(){
							if (self.brush.active) {
								self.blank = !self.brush.strokeEnd() && self.blank;
							}
						});
				}

				self.init();
			}

			// Extendiendo el Objeto untScribble
			untScribble.prototype = {

				init: function() {
					var self = this;

					if (settings.initContent.length != 0) {
						settings.initContent.forEach(function(point) {
							self.brush.strokeMove(point.x, point.y);
						});

						self.blank = !self.brush.strokeEnd() && self.blank;
					}
				},

				clear : function() {
					var context = this.canvas.getContext('2d')
						,width = this.canvas.width
						,height = this.canvas.height;

					context.clearRect(0, 0, width, height);

					if (settings.fillOnClear) {
						context.fillStyle = settings.backgroundColor;
						context.fillRect(0, 0, width, height);
					}
					this.blank = true;
					return this;
				},

				add: function(args) {
					var self = this
						,path = JSON.parse(args.path)
						,brush = (self.brush.brushColor == 'eraser') ? EraserBrush : BasicBrush
						,color = self.brush.brushColor
						,size = self.brush.brushSize;

					if (args.brushSize != self.brush.brushSize || args.brushColor != self.brush.brushColor ) {
						var brs = (args.brushColor == 'eraser') ? EraserBrush : BasicBrush;

						self.update({
							brush: brs,
							brushColor: args.brushColor,
							brushSize: args.brushSize
						});
					}
					var scribble = noteboard.scribble;
					noteboard.scribble = true;
					
					var point = path.shift();
					self.brush.strokeBegin(point.x, point.y);

					path.forEach(function(point) {
						self.brush.strokeMove(point.x, point.y);
					});

					self.brush.realTime = true;
					self.blank = !self.brush.strokeEnd() && self.blank;

					if (size != self.brush.brushSize || color != self.brush.brushColor) {
						self.update({
							brush: brush,
							brushColor: color,
							brushSize: size
						});
					}

					noteboard.scribble = scribble;
				},

				update: function(options, reset) {
					var newBg = !!options.backgroundColor;
            		var newImg = !!options.backgroundImage;
		            var newWidth = !!options.width;
		            var newHeight = !!options.height;
		            var newBrush = !!options.brush;

		            $.extend(settings, options);		            

		            var context = this.canvas.getContext("2d");

		            if(newBrush) this.brush = new settings.brush();
		            this.brush._init(context, settings.brushSize, settings.brushColor);

		            if(newWidth)this.canvas.width = settings.width;
		            if(newHeight)this.canvas.height = settings.height;
		            if(newBg || newImg || newWidth || newHeight || reset) this.clear();
		            if(newImg) {
		                addImage(context);
		                this.blank = false;
		            }

		            return this;
				}
			}

			/**
			 * Plugin JQuery.
			 * 
			 * @param  Object options Objeto de parámetros de configuración.
			 * @return JQuery-Obj Objeto query.
			 */
			$.fn.untScribble = function(options) {
				return this.each(function() {
					if (!$.data(this, 'scribble')) $.data(this, 'scribble', new untScribble(this, options));
				});
			}

		})(jQuery);

		// Retornando interfaz del módulo
		return {
			init: _init
		}
	}
);