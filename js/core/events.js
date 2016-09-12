/**
 * Módulo de eventos
 *
 * @package     webroot.plugins
 * @subpackage  noteboard.js.core
 * @author      JpBaena13
 */
define(
	function() {
		var _events = {}

		//Suscripción a un evento
		var _on = function( type, callback, module ) {
			if (!_events[type]) {
				_events[type] = [];
			}

			_events[type].push({
				callback: callback,
				context: module
			})
		}

		//Eliminación de un evento
		var _off = function( type, callback, module ) {
			if (!_events[type]) {
				return false;
			}

			for (var i = _events[type].length; i--; ) {
				info = _events[type][i];
				
				if (info.context == module && (!callback || info.callback == callback)) {
					_events[type].splice(i, 1);
				}
			}
		}

		//Emitir evento
		var _emit = function( type, args ) {
			if (!_events[type]) {
				return false;
			}

			for (var i in _events[type]) {
				info = _events[type][i];
				info.callback.apply(info.context, args);
			}

			if (type != 'all') {
				info = _events['all'] || [];				

				for (var i = info.length; i--; ) {
					tuple = info[i];
					tuple.callback.apply(tuple.context, args)
				}
			}
		}

		// Retornando interface del módulo
		return {
			on: _on,
			off: _off,
			emit: _emit
		}
	}
);