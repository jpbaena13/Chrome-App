/**
 * Módulo para inclusión de lineas horizontales y verticales en los notebaords
 *
 * @package     webroot.js
 * @subpackage  modules
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

			$this.sandbox.on('line-add', _createLine);
		}

		/**
		 * Permite la creación de una línea vertical u horizontal
		 * 
		 * @param Object args Objeto de parámetros
		 *               args -> Object {left, top}
		 *
		 * @param string dir Define la dirección de la línea (horizontal, vertical)
		 */
		var _createLine = function(args, dir) {
			var pos = (dir == 'left') ? args.left : args.top;

			line = _instanceLine(pos, dir);
			
			noteboard.jsp.getContentPane().append(line);
		}

		/**
		 * retorna objeto jQuery con la representación de la línea
		 * 
		 * @param  int pos Posición de la línea
		 * @param  string dir Indica si la línea es vertical (left) u horizontal (top)
		 * 
		 * @return Object Objeto jQuery
		 */
		var _instanceLine = function(pos, dir) {
			var line = $('<div>', {Class: 'untLineBoard'})

			line.on('click', function(e){
				if (noteboard.shiftPress)
					line.remove();
			});

			if (dir == 'top') {
				line
					.draggable({
						containment: 'parent',
						axis: 'y'
					})
					.css({
						top: pos,
						width: '100%',
						position: 'absolute',
						cursor: 'n-resize'
					})
					.focus()
			} else {
				line
					.draggable({
						containment: 'parent',
						axis: 'x'
					})
					.css({
						left: pos,
						height: '100%',
						position: 'absolute',
						cursor: 'w-resize'
					})
					.focus()
			}

			return line;
		}

		// Retornando interface del módulo
		return {
			init: _init
		}
	}
);