/**
 * Módulo para historial de actividades
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
		 * Función de inicio del módulo
		 */
		var _init = function() {
			$this = this;
			$this.sandbox = new sandbox($this);

			if (noteboard.user.id != null) {
				$.getJSON(
					API + 'Activity/Noteboard/' + noteboard.id,
					function(data) {
						_createComponent(data);
					}
				);
			}
		}

		var _createComponent = function(activities) {

			var container = $('<div>', {id: 'historyContainer'}).appendTo( $('body') ).draggable({containment: 'parent'})
				,title = $('<div>', {Class: 'title'}).html('<div class="circle"></div>' + i18n.activities).appendTo( container )
				,historyWrapper = $('<div>', {Class: 'historyWrapper'}).appendTo( container );

			activities.forEach(function(activity){
				var historyBlock = $('<div>', {Class: 'historyBlock'}).appendTo( historyWrapper )
					,profileImage = $('<img>', {Class: 'profileImage', src: activity.user.profileImage}).appendTo( historyBlock )
					,actionContainer = $('<div>', {Class: 'actionContainer'}).appendTo( historyBlock )
					,action = $('<div>', {Class: 'action'}).html( activity.text ).appendTo( actionContainer )
					,date = $('<div>', {Class: 'date'}).html( $.timeago(activity.activityDate) + '<span class="icon-alarm"></span>' ).appendTo( actionContainer );

				historyBlock.on('click', function(){
					var model = $('#n-' + activity.noteId).data('model');
					noteboard.zoom(1);
					noteboard.moveNoteboard({left: model.data.l - 10, top: model.data.t - 10});
				});
			});

			historyWrapper.jScrollPane({
				verticalGutter: 0,
				verticalDragMinHeight: 30,
			});

			container.hide();
		}


		// Retornando interface del módulo
		return {
			init: _init
		}
	}
)