$(function() {
	// Code to be executed once the DOM is ready
	$.get('./chats.html', function(html){
		console.log('chatlist?');
		$("#content").html(html);
	});
});