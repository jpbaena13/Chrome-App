/*!
 * JQuery Placeholder Plug-in 0.1
 * 
 * @author      JpBaena13
 */
;(function($, undefined) {
	
	$.fn.placeholder = function(options) {

		var defaults = {
			text: 'Ingrese texto',
			color_focus: '#000',
            color_blur: '#999',
            valid: false, // Este atributo genera una dependencia con jquery.validate
            autoResize: false,
            pressEnter: function() { }
		}

		return this.each(function(i) {
			var opts = $.extend({}, defaults, options),
				$this = $(this)
			
			if (typeof(Modernizr) != 'undefined' && Modernizr.input.placeholder) {
				if ($this.attr('placeholder') === undefined || $this.attr('placeholder') === '') {					
					$this.attr('placeholder', opts.text);
				}

				if (opts.autoResize)
                    $this.autoResize(opts)

				return;
			}

			//Declaración de Funciones
			var _init = function() {
				
				if ($this.attr('placeholder') != '') {
					opts.text = $this.attr('placeholder')
				}

				if ($.trim($this.val()) == '') {
	                $this.val(opts.text);
                    $this.css('color', opts.color_blur);

	            } else if ($this.val() != opts.text) {
                    $this.css('color', opts.color_focus);

	                if (opts.valid) {
	                    $this.valid();
	                }
	            }
			},
			_focus = function() {
				if ($.trim($this.val()) == opts.text) {
                    $this.val('');
                    $this.css('color', opts.color_focus);
                }
			},
			_blur = function() {
				if ($.trim($this.val()) == '' || $.trim($this.val()) == opts.text) {
                    if (opts.valid) {
                        $this.val('');
                        $this.valid();
                    }

                    $this.val(opts.text);
                    $this.css('color', opts.color_blur);
                }
			},
			_keypress = function(e) {
				if (e.which == 27) {	 	//ESC
                    e.preventDefault();
                    return false;
                }

                if (e.which == 13) {		//ENTER
                    opts.pressEnter();
                }

                return true
			}

			if (opts.autoResize)
                    $this.autoResize(opts)

            _init();
            $this.on('blur', _blur)
			$this.on('keypress', _keypress)
			$this.on('focus', _focus)
        });
	}

	$.fn.extend({
		autoResize: function(options){
			//Si no se envía nada, se crea un objeto vacío para que no de error a continuación
			if(!options){
				options = {};
			}
			//Almacena las opciones pasadas a la función o valores predeterminados en su defecto
			var _options = {
				//Maximo en altura que podrá alcanzar, luego se aplicará scrollbar
				maxHeight: options.maxHeight || null,
				//Altura que tomará al coger el foco
				minHeight: options.minHeight || null,
				//Clase que se añadirá cuando recibe el foco
				activeClass: options.activeClass || null
			};
			return this.each(function(){
				//Encapsulamos con jQuery
				var $this = $(this);

				//Guarda la altura inicial
				$this.initHeight = $this.css("height");
				//Establece el atributo CSS overflow según el caso
				if(_options.maxHeight){
					$this.css("overflow", "auto");
				}else{
					$this.css("overflow", "hidden");
				}
				//Para guardar el texto y comparar si hay cambios
				var _value = null;
				//Crea el clon del textarea
				var $clon = $this.clone(true);
				//Establece propiedades del clon y lo añade al DOM
				$clon.css({
					visibility: "hidden",
					position: "absolute",
					top: 0,
					overflow: "hidden",
					width: parseInt($this.width())-10
				});
				$clon.attr("name","");
				$clon.attr("id", "");
				$this.parent().append($clon);
				//Aux
				var clon = $clon[0];
				var me = $this;
				//Eventos del textarea
				$this.bind("keyup" , autoFit)
					.bind("focus", function(){
						if(_options.minHeight){
							me.css("height", _options.minHeight+"px");
							$clon.css("height", _options.minHeight+"px");
							autoFit(true);
						}
						if(_options.activeClass){
							me.addClass(_options.activeClass);
						}
					})
					.bind("blur", function(){
                        if(_options.minHeight && me.initHeight){
                            $clon.css("height", me.initHeight);
                            me.css("height", me.initHeight);
                        }
						
						if(_options.activeClass){
							me.removeClass(_options.activeClass);
						}

                        autoFit();
					});
				function autoFit(force){
				    	clon.value = me.val();
				    	//Comprueba si ha cambiado el valor del textarea
				    	if (_value != clon.value || force===true){
                            _value = clon.value;
                            var h = clon.scrollHeight;
                            if(_options.maxHeight && h > _options.maxHeight){
                            me.css("height", _options.maxHeight + "px");
                            }else{
                                me.css("height", parseInt(h) + "px");
                            }
				    	}
				}
			});
		}
	})
})(jQuery);

//Apicando Placeholder a todos los elementos que contengan esta propiedad
$(function(){
	$('[placeholder]').placeholder();
})