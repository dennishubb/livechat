$(function() {
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatlist/chatlist.css">');

	var data = {'merchant_id':5, }
	$.post('api.livechat.com/chats/get', data, success, dataType, function(data){
		console.log(data);
	});
});