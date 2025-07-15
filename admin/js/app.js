require.config({
	baseUrl: '.',
	paths: {
		jquery: 'lib/jquery-1.11.2.min',
		underscore: 'lib/underscore-1.7.0.min',
		backbone: 'lib/backbone-1.1.2.min',
		text: 'lib/text-2.0.12',
		views: 'js/views',
		models: 'js/models'
	},
	deps: [
		'js/common',
		'lib/moment.min',
		'lib/SMSCounter',
		'plugins/simplePagination/simplePagination'
	],
	shim: {
		'backbone': ['js/common','jquery'],
		'js/common': ['underscore'],
		'plugins/simplePagination/simplePagination': ['jquery'],
		'text':['jquery'],
		'lib/SMSCounter':['jquery']
	},
	urlArgs: 'v='+VERSION,
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port) {
				return true;
			},
			onXhrComplete: function (xhr,url) { // for development only, will not run after build
				var tmp = url.replace('.html','.css');
				$.get(tmp,function(css) {
					var style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = css;
					document.getElementsByTagName("head")[0].appendChild(style);
				});
			}
		}
	}
});

require(['backbone', 'js/router', 'views/main/main'], function(Backbone, Router, MainView) {
	
	Backbone.emulateJSON = true;
	
	if (typeof cordova !== 'undefined') {
		document.addEventListener('deviceready',function() {
			MainView.render();
		},false);
	} else {
		MainView.render();
	}
});