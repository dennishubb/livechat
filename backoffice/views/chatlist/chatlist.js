$(function() {
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatlist/chatlist.css">');

	var request = {'merchant_id':5,};
	$.post('http://api.livechat.com/v1/chats/get', request, function(data){
		console.log("api");
		console.log(data);
	});
});