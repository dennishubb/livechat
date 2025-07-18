require.config({
	baseUrl: '.',
	paths: {
		jquery: 'lib/jquery.min',
		underscore: 'lib/underscore.min',
		backbone: 'lib/backbone',
		text: 'lib/text',
		views: 'views'
	},
	deps: [
		'js/common',
		'lib/moment.min',
		'lib/simplePagination/simplePagination'
	],
	shim: {
		backbone: {
			deps: ['js/common', 'jquery', 'underscore'],
			exports: 'Backbone'
		},
		'js/common': ['underscore'],
		'lib/simplePagination/simplePagination': ['jquery'],
		'text':['jquery']
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

	Backbone.View.prototype.goTo = function (fragment,options) {
		Router.navigate(fragment,options);
	};
	
	if (typeof cordova !== 'undefined') {
		document.addEventListener('deviceready',function() {
			MainView.render();
		},false);
	} else {
		MainView.render();
	}
});