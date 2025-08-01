require(['jquery', 'underscore', 'lib/moment.min', 'lib/Autolinker.min', 'lib/recorder.min'], function($,_,moment,Autolinker,Recorder){

	var full_templates = [];
	var templates = [];
	var shortcuts = [];
	var template_id = 0;
	var pressSendTimer;
	var templatesFlag = false;
	var voicesend = 0;
	var pin_id = 0;
	var messages = [];
	var player_name = '';

	$(function() {
		$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatroom/chatroom.css">');

		const request = new URLSearchParams(
			{
				merchant_id: merchant_id, 
				user_id: user_id
			}
		).toString();

		//add checking if registered user, call api. else dont
		getMessage();

		function getMessage(){
			$.get('http://api.livechat.com/v1/chats/messages/get', request, function(response){
				const resp = JSON.parse(response);
				console.log(resp);
	
				if(resp.status === 200){
					const data = resp.data;
	
					player_name = data.chat.user_name;
					messages = data.messages;
					showMessage();
				}
			}).done(function(response){
				scrollToBottom();
			});
		}
		
		function showMessage() {
			var today = moment().format('D MMM YYYY');
			var lastCreatedDateTime = '';
			var lastMsgTime = '';
			var h = '';
			var aR = false; // adminResponse
			_.each(messages.reverse(), function(m) {
				if (m.status !== 2) {
					var createdDateTime = moment(m.created_at);
					if (lastCreatedDateTime === '' || createdDateTime.diff(lastCreatedDateTime) > 600000) {
						var msgDate = createdDateTime.format('D MMM YYYY');
						var msgTime = msgDate === today ? createdDateTime.format('h:mma') : msgDate;
						if (msgTime !== lastMsgTime) {
							lastMsgTime = msgTime;
							h+= '<div class="time">'+msgTime+'</div>';
						}
						lastCreatedDateTime = createdDateTime;
					}
					h+= '<div class="message '+(m.last_message_user_id === user_id ? 'myself' : 'staff')+'">'+
							'<div class="message-wrapper copy-text">'+
								'<span class="name">'+m.user_name+'</span>'+
								'<span class="copy fa fa-copy"></span>'+
								'<span class="text">'+getMessageHtml(m.message)+'</span>'+
							'</div>'+
						'</div>';
					if (m.message.includes('@endChat') && m.last_message_user_id !== user_id) {
						h = h.replaceAll('@endChat','');
						h+= '<div class="chat-ended">Chat ended</div>';
						endChat(m.id);
					}
				}
			});
			if (h) {
				var chatToolHeight = $('.chat-tools').height();
				$('.scrollable').css('height','calc(100% - '+chatToolHeight+'px)');
				$('.wrapper').html(h);
			}
		};
		
		function getMessageHtml(message) {
			var self = this;
			if (message.indexOf('firebasestorage') > 0) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (message.indexOf('.jpg') > 0 || message.indexOf('.png') > 0 || message.indexOf('.gif') > 0)) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (message.indexOf('.ogg') > 0)) {
				message = '<audio controls><source src="'+message+'" type="audio/ogg"></audio>';
			} else {
				message = Autolinker.link(message.replace(/(?:\r\n|\r|\n)/g, '<br>'));
			}
			return message;
		};
		
		function scrollToBottom(force) {
			var hidden = false;
			if ($('.scrollable').css('visibility') === 'hidden') {
				hidden = true;
				$('.scrollable').css('visibility','visible');
			}
			if (force || hidden || $('.scrollable')[0].scrollTop + $('.scrollable').height() + 200 >= $('.scrollable')[0].scrollHeight) {
				$('.scrollable').scrollTop($('.wrapper').height());
			}
		};
	});
});