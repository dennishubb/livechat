require.config({
	baseUrl: '.',
	paths: {
		jquery: 'lib/jquery.min',
		underscore: 'lib/underscore.min',
		backbone: 'lib/backbone',
		text: 'lib/text',
		views: 'views',
		router: 'js/router'
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

require(['jquery'], function($, router) {
	$(function() {
		console.log('init');
		$("#init").load('../views/main/main.html');
		$html = router.route_path();
		$("#content").load($html)
	});
});