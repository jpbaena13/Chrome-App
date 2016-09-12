/**
 * Módulo principal de aplicación
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js
 * @author      JpBaena13
 */
define(
	[
		WEBROOT_URL + 'js/modules/noteboard.js',
		WEBROOT_URL + 'js/modules/resource.js',
		WEBROOT_URL + 'js/modules/previewer.js',
		WEBROOT_URL + 'js/modules/noteMenu.js',
		// WEBROOT_URL + 'js/modules/persistent.js',
		// WEBROOT_URL + 'js/modules/realtime.js',
		WEBROOT_URL + 'js/modules/scribble.js',
		WEBROOT_URL + 'js/modules/timeline.js',
		// WEBROOT_URL + 'js/modules/permissions.js',
		// WEBROOT_URL + 'js/modules/history.js',
	], 
	function() {
		var modules = Array.prototype.slice.call(arguments);

	    return {
	        init: function(args) {
				for (var name in modules) {
					modules[name].init(args);
				}

				var noteboard = modules[0];

				for(var f in noteboard.readyFunctions ) {
					noteboard.readyFunctions[f]();
				}
    		}
		}
	}
)