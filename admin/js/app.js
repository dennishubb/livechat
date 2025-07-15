require.config({
	baseUrl: '.',
	paths: {
		jquery: '/admin/lib/jquery-1.11.2.min',
		underscore: '/admin/lib/underscore-1.7.0.min',
		backbone: '/admin/lib/backbone-1.1.2.min',
		text: '/admin/lib/text-2.0.12',
		views: '/admin/views'
	},
	deps: [
		'/admin/js/common',
		'/admin/lib/moment.min',
		'/admin/lib/SMSCounter'
	],
	shim: {
		'backbone': ['admin/js/common','jquery'],
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