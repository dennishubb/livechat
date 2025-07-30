require.config({
	baseUrl: '.',
	paths: {
		jquery: 'lib/jquery.min',
		underscore: 'lib/underscore.min',
		backbone: 'lib/backbone',
		text: 'lib/text',
		views: 'views',
		router: 'js/router',
		autolinker: 'js/Autolinker.min'
	},
	deps: [
		'js/common',
		'lib/moment.min',
		'lib/simplePagination/simplePagination'
	],
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [ 'underscore', 'jquery', 'js/common'],
			exports: 'backbone'
		},
		'js/common': ['underscore'],
		'lib/simplePagination/simplePagination': ['jquery'],
		'text':['jquery']
	},
});

require(['jquery', 'router'], function($, router) {
	$(function() {
		$("#init").load('/views/main/main.html', function(){
			$("#content").load(route_path())
		});

		$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
			jqXHR.setRequestHeader('X-Authorization-Key', 'QrtYujorR1Y4gGaxO2CAilCGQzTiLL6tM84Pap5y14vY57v3W5IMKthcCGPEEVmV');
		});
	});
});