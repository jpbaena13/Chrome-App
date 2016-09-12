/**
 * Módulo para inclusión de menú de notas
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
		var _init = function() {

			$this = this;
			$this.sandbox = new sandbox($this);
			$this.itemsDisabled = [];

			$.contextMenu({
                selector: '.untMenu',
                items: _items(),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');

                	if (noteboard.permissions !== true && !noteboard.permissions.canEdit) {
                		$this.itemsDisabled['lock'] = true;
                		$this.itemsDisabled['unlock'] = true;

                	} else {
	                	$this.itemsDisabled['lock'] = model.data.locked;
	                	$this.itemsDisabled['unlock'] = !model.data.locked;
	                }
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });

            $.contextMenu({
                selector: '.untMenuImage',
                items: _items('image'),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');
                	
                	$this.itemsDisabled['lock'] = model.data.locked;
                	$this.itemsDisabled['unlock'] = !model.data.locked;
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });

            $.contextMenu({
                selector: '.untMenuCircle',
                items: _items('circle'),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');
                	
                	$this.itemsDisabled['lock'] = model.data.locked;
                	$this.itemsDisabled['unlock'] = !model.data.locked;
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });

            $.contextMenu({
                selector: '.untMenuVideo',
                items: _items('video'),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');
                	
                	$this.itemsDisabled['lock'] = model.data.locked;
                	$this.itemsDisabled['unlock'] = !model.data.locked;
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });

            $.contextMenu({
                selector: '.untMenuFrame',
                items: _items('frame'),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');
                	
                	$this.itemsDisabled['lock'] = model.data.locked;
                	$this.itemsDisabled['unlock'] = !model.data.locked;
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });

            $.contextMenu({
                selector: '.untMenuComment',
                items: _items('comment'),
                build: function($trigger, e) {
                	$this.note = $trigger;
                	var model = $this.note.data('model');
                	
                	$this.itemsDisabled['lock'] = model.data.locked;
                	$this.itemsDisabled['unlock'] = !model.data.locked;
                },
                callback: function(key, options) {
                	_callback(key);
                }
            });
            
			$.contextMenu({
                selector: '#noteboard',
                items: _noteboardItems() ,
                build: function($trigger, e) {
                	$this.note = $trigger;
                	$this.event = e;
                },
                callback: function(key, options) {
					_callback(key);
                }
            });
		}

		/**
		 * Función callback para la opciópn disabled del contextMenu
		 * 
		 * @param  string key Llave que identirica la opcoón del menú
		 * 
		 * @return boolean     Retorna true o false que determina si la opción está deshablitada.
		 */
		var _disabled = function(key) {
			return $this.itemsDisabled[key];
		}

		/**
		 * Retorna el JSON de items del menú contextual
		 * 
		 * @return JSON Items del menú
		 */
		var _items = function(Class) {
			var items =  {
				lock: 	{name: i18n.lockResource, icon: 'lock', disabled: _disabled},
				unlock: {name: i18n.unlockResource, icon: 'unlocked', disabled: _disabled},
				sep1: 	"----------",
				forward:{name: i18n.sendForward, icon: 'copy', disabled: _disabled},
				back: 	{name: i18n.sendBack, 	 icon: 'copy2', disabled: _disabled},
				sep2: 	"----------",
				bg: {
                		name:i18n.changeBG,
            			icon: 'droplet',
            		  	items: {
                		  	menuColor: 	{className:'menuColor', name: _menuColor}
            		  	},
            		  	disabled: _disabled
        		},
        		size: {
                		name: i18n.changeSize, 
                		icon: 'text-height',
                		items: {
                		 	'fs-0.8em'	: {name: 'x-small',	className: 'xsmall'},
                		 	'fs-1em'	: {name: 'small',	className: 'small'},
                		 	'fs-1.2em'	: {name: 'normal',	className: 'normal'},
                		 	'fs-1.4em'	: {name: 'large',	className: 'large'},
                		 	'fs-1.8em'	: {name: 'x-large',	className: 'xlarge'}
        		 		},
        		 		disabled: _disabled
    		 	},
    		   	family: {
    		   			name: i18n.changeFont,
            		    icon: 'font',
            		    items: {
            		   		'ff-paprika'	: 	{name: 'Paprika', 	className: 'paprika'},
            		   		'ff-arial'		: 	{name: 'Arial', 	className: 'arial'},
            		   		'ff-courier'	: 	{name: 'Courier', 	className: 'courier'},
            		   		'ff-times'		: 	{name: 'Times',		className: 'times'},
            		   		'ff-agenda'		: 	{name: 'Agenda', 	className: 'agenda'}
            		   	},
            		   	disabled: _disabled
    		   	},
        		color: {
        				name: i18n.changeColor,
            		  	icon: 'paint-format',
            		  	items: {
            		  		'c-black'	: 	{name: i18n.black,	className: 'black'},
            		  		'c-red'		: 	{name: i18n.red, 	className: 'red'},
            		  		'c-blue'	: 	{name: i18n.blue,	className: 'blue'},
            		  		'c-green'	: 	{name: i18n.green,	className: 'green'},
            		   		'c-gray'	: 	{name: i18n.gray ,	className: 'gray'}
            		   	},
            		   	disabled: _disabled
    			},
    		    attach: {name: i18n.attachNote, icon: 'attachment', disabled: _disabled},
    		    downloadImage : {  name: i18n.downloadImage, icon: 'download3', disabled: _disabled},
    		    previewImage : { name: i18n.previewImage, icon: 'image', disabled: _disabled},
    		    sep3: "----------",
    		    remove: {name: i18n.removeNote, icon: 'remove', disabled: _disabled}
            }

            switch(Class) {
            	case 'image':
            		items.bg 	 = undefined
	            	items.size 	 = undefined;
	            	items.family = undefined;
	            	items.color  = undefined;
	            	items.attach = undefined;            	
	            	items.remove.name = i18n.removeImage;
	            	break;

            	case 'circle':
	            	items.size 	 = undefined;
	            	items.family = undefined;
	            	items.color  = undefined;
	            	items.attach = undefined;
	            	items.downloadImage = undefined;
            		items.previewImage = undefined;
            		items.remove.name = i18n.removeObject;
            		break;

        		case 'video':
        			items.bg 	 = undefined;
        			items.size 	 = undefined;
	            	items.family = undefined;
	            	items.color  = undefined;
	            	items.attach = undefined;
	            	items.downloadImage = undefined;
            		items.previewImage = undefined;
            		items.sep2 = undefined;
            		items.remove.name = i18n.removeVideo;
        			break;

        		case 'frame':
        			items.bg 	 = undefined;
        			items.size 	 = undefined;
	            	items.family = undefined;
	            	items.color  = undefined;
	            	items.attach = undefined;
	            	items.downloadImage = undefined;
            		items.previewImage = undefined;
            		items.sep1 = undefined;
            		items.remove.name = i18n.removeArea;
        			break;

        		case 'comment':
            		items.bg.name = i18n.changeBGComment;
        			items.size 	 = undefined;
	            	items.family = undefined;
	            	items.color  = undefined;
	            	items.attach = undefined;
	            	items.downloadImage = undefined;
            		items.previewImage = undefined;
            		items.sep1 = undefined;
            		items.remove.name = i18n.removeComment;
        			break;

        		default: 
        			items.downloadImage = undefined;
            		items.previewImage = undefined;
            }
            	
            
            return items;
		}

		/**
		 * Retorna el JSON de items del menú contextual
		 * 
		 * @return JSON Items del menú
		 */
		var _noteboardItems = function() {
			return {
				note	: {name: i18n.addNote, icon: 'file'},
				image	: {name: i18n.addImage, icon: 'image'},
				video	: {name: i18n.addVideo, icon: 'play'},
				comment	: {name: i18n.addComment, icon: 'bubbles'},
				sep1	: "----------",
				lockAll 	: {name: i18n.lockAllResources, icon: 'lock', disabled: _disabled},
				unlockAll 	: {name: i18n.unlockAllResources, icon: 'unlocked', disabled: _disabled},
            }
		}

		/**
		 * Retorna objeto jQuery que contiene el menú para selección de color
		 * 
		 * @return jQuery Objeto jQuery con el menú de color
		 */
		var _menuColor = function() {
			var colorInit = undefined
				, color = undefined;

			var $menuColor = $('<div>',{id: 'untMenu'})
		        .on('mouseover', function(e) {		        	
		        	if (colorInit == undefined) {
	                	colorInit = $this.note.data('bg');
	                	color = colorInit;
	            	}
	                
	                if ($(e.target).attr('class') != undefined) {
		                $this.note.removeClass(color);
	                    color = $(e.target).data('color');
		                $this.note.addClass(color);
		            }

	            })

	            .on('mouseout', function(e) {
	            	$this.note.removeClass(color);

	                if (colorInit != undefined) {
	                    $this.note.addClass(colorInit);
	                    colorInit = undefined;
	                }
	            })

				.on('click', function(e) {
	               	$(this).off('mouseout'); // Evita que se ejecute este evento.
	               	$this.note.data('model').setBG({bg: color});
	            })

	            .html('<ul>\
	                    <li class="untPreviewNote yellow" data-color="yellow"></li>\
	                    <li class="untPreviewNote red" data-color="red"></li>\
	                    <li class="untPreviewNote orange" data-color="orange"></li>\
	                    <li class="untPreviewNote green" data-color="green"></li>\
	                    <li class="untPreviewNote blue" data-color="blue"></li>\
	                    <li class="untPreviewNote violet" data-color="violet"></li>\
	                    <li class="untPreviewNote pink" data-color="pink"></li>\
	                    <li class="untPreviewNote lgray" data-color="lgray"></li>\
	                    <li class="untPreviewNote gray" data-color="gray"></li>\
	                </ul>');

            return $menuColor;
		}

		/**
		 * Función de retorno que se ejectura cuando un elemento del menú ha sido seleccionado
		 * 
		 * @param  string  key clave del elemento del menú seleccionado
		 */
		var _callback = function(key) {
			var split = key.split('-')
				, context = split[0]
				, key = split[1] || split[0]
				, model = $this.note.data('model')
				, args = { id: $this.note.attr('data-id') };

			switch (context) {
				case 'ff':
					model.setFF( {ff: key} );
					return;

				case 'fs':
					model.setFS( {fs: key} );
					return;

				case 'c':
					model.setC( {c: key} );
					return;

				case 'forward':
					model.incrementIndex( {} );
					return;

				case 'back':
					model.decrementIndex( {} );
					return;

				case 'remove':
					model.remove( {} );
					return;

				case 'attach':
					model.attachZone();
					return;

				case 'lock':
					model.setLocked(true);
					return;

				case 'unlock':
					model.setLocked(false);
					return;

				case 'lockAll':
					noteboard.models.forEach(function(model){
						model.setLocked(true);
					})
					return;
					
				case 'unlockAll':
					noteboard.models.forEach(function(model){
						model.setLocked(false);
					})
					return;

				// Eventos del menú contextual del noteboard
				case 'image':
				case 'note':
				case 'circle':
				case 'video':
				case 'comment':
					args.l = ($this.event.pageX - noteboard.target.offset().left) / noteboard.scale;
					args.t = ($this.event.pageY - noteboard.target.offset().top) / noteboard.scale;
					break;
			}

			$this.sandbox.emit('resource-' + context, args);
		}

		// Retornando interface del módulo
		return {
			init: _init
		}

	}
);