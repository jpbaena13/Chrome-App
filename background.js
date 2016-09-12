chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window.html', {
		'outerBounds': {
			'width': 800,
			'height': 800
		}
	});
});

$(function(){
	require([WEBROOT_URL + 'js/noteboardApp.js'], function(noteboardApp) {
	    noteboardApp.init({
	        noteboard: {
	        				"id": 16,
	        				"workspaceId": null,
	        				"userId": 1,
	        				"name": "Unlimited",
	        				"description":"",
	        				"creationDate":"2015-09-30 13:34:06",
	        				"deleted":0,"type":"noteboard",
	        				"url":"GPjsuUMKvU",
	        				"visibility":"private",
	        				"background":"grid.png",
	        				"modified":0,
	        				"modifiedDate":"2015-10-08 09:54:02",
	        				"parentId":1,
	        				"groupId":null,
	        				"categoryId":1,
	        				"token":null,
	        				"owner":true,
	        				"category":
	        							{
	        								"id":1,
	        								"creatorId":1,
	        								"name":"Libre",
	        								"bgBodyColor":"ffffff",
	        								"bgImageBoard":"grid.png",
	        								"class":"",
	        								"repeat":"repeat",
	        								"height":2000,
	        								"width":4000,
	        								"visibility":"public",
	        								"creationDate":"2015-09-14 09:44:54"
	        							},
	        				"user":
	        						{
	        							"id":1,
	        							"fullname":"Juan Pablo Baena",
	        							"username":"jpbaena13",
	        							"profileImage":"img\/default\/profile.jpg","maxFiles":30,"maxFileSize":500
	        						},
							"collaborators": [
												{
													"userId":1,
													"firstname":"Juan Pablo",
													"lastname":"Baena",
													"fullname":"Juan Pablo Baena",
													"username":"jpbaena13",
													"profileImage":"img\/default\/profile.jpg"
												}
											]
	        			}
	    });
	});

	
	// var onInitFs = function(fs) {
	// 	console.log('Opened file system: ' + fs.name);
	// }

	// var errorHandler = function() { }

	// window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	// window.requestFileSystem(window.PERSISTENT, 5*1024*1024, onInitFs, errorHandler);
});