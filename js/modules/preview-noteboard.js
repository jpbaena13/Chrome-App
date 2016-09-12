/**
 * Módulo del noteboard
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.modules
 * @author      JpBaena13
 */

'use strict';

define(
	[
		WEBROOT_URL + 'js/core/sandbox.js'
	], 
	function(sandbox) {

		var $this = undefined

		/**
		 * Función de inicio de módulo
		 */
		var _init = function(args) {
			$this = this;
			$this.sandbox = new sandbox(this);
		}

		// Retornando interfaz del módulo
		return {
			id: $('#noteboard').data('noteboardid'),
			target: $('#noteboard'),
			models: [],
			init: _init,
		}
	}
);