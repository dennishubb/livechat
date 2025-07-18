$(function() {

	console.log('chatlist');
	//initialize styles and html
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatlist/chatlist.css">');
	$("#content").load('/views/chatlist/chatlist.html');

});