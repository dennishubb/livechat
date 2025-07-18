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

require(['jquery', 'underscore'], function($, _) {
	$(function() {
	
		console.log('init');
		//initialize styles and html
		const _ = require('underscore');
		var mainview = _.template('text!views/main/main.html');
	
		$("#init").append(mainview);
	
	});
});