$(function() {
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatlist/chatlist.css">');

	var request = {'merchant_id':5, }
	$.post('api.livechat.com/chats/get', request, function(data){
		console.log(data);
	});
});