/**
 * Módulo Sandbox
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.core
 * @author      JpBaena13
 */
define(
	[
		WEBROOT_URL + 'js/core/events.js'
	], 
	function(Events) {

		function F(module) {
			this.module = module;
		}

		F.prototype = {
			events: Events,
			init: function(module) {
				this.module = module;
				return this;
			},
			on: function( type, callback ) {
				this.events.on(type, callback, this.module);
			},
			off: function(type, callback) {
				this.events.off(type, callback, this.module);
			},
			emit: function( type ) {
				args = Array.prototype.slice.call(arguments, 1);
				this.events.emit(type, args);
			}
		}

		return F;
	}
);