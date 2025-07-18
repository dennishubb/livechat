$(function() {
	// Code to be executed once the DOM is ready
	$.get('./chatlist.html', function(html){
		$("#content").html(html);
	});
});