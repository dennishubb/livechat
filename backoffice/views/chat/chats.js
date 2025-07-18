$(function() {
	// Code to be executed once the DOM is ready
	$("head").append("<link rel='stylesheet' href='./chatlist.css' type='text/css'>");

	$.get('./chatlist.html', function(html){
		$("#content").html(html);
	});
});