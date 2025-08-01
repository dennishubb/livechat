require(['jquery', 'underscore', 'lib/moment.min', 'lib/Autolinker.min', 'lib/recorder.min'], function($,_,moment,Autolinker,Recorder){

	var full_templates = [];
	var templates = [];
	var shortcuts = [];
	var template_id = 0;
	var pressSendTimer;
	var templatesFlag = false;
	var voicesend = 0;
	var pin_id = 0;

	$(function() {
		$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatroom/chatroom.css">');

		// const request = new URLSearchParams(
		// 	{
		// 		merchant_id: merchant_id, 
		// 		chat_id: chat_id
		// 	}
		// ).toString();

		// getMessage();

		// function getMessage(){
		// 	$.get('http://api.livechat.com/v1/chats/messages/get', request, function(response){
		// 		const resp = JSON.parse(response);
	
		// 		console.log(resp);
	
		// 		if(resp.status === 200){
		// 			const data = resp.data;
	
		// 			const player_id = data.chat.user_id;
		// 			const player_name = data.chat.user_name;
		// 			pin_id = data.chat.pin_id;
		// 			var today = moment().format('D MMM YYYY ');
		// 			var h = '';
		// 			_.each(data.messages.reverse(), function(m) {
		// 				if(m.status === '2') return;
		// 				var createdDateTime = moment(m.created_at);
						
		// 				h+= '<div class="message '+(m.user_id !== player_id ? (m.user_id === user_id ? 'myself' : 'staff') : 'customer')+'">'+
		// 						'<p class="btn danger delete fa fa-trash-o" data-id="'+m.id+'"></p>'+
		// 						'<p class="time">'+createdDateTime.format('D MMM YYYY h:mma').replace(today,'')+'</p>'+
		// 						'<p class="channel '+showChannel(m)+' '+(m.status || '')+'">'+showChannel(m)+'</p>'+
		// 						'<p class="name">'+(m.user_id !== player_id ? m.name : '<span class="profile"><i class="fa fa-user"></i>'+player_name+'</span>')+'</p>'+
		// 						'<p class="text">'+showMessage(m.message)+'</p>'+
		// 					'</div>';
		// 			});
		// 			// $('.action.profile').html(player_name);
		// 			$('.wrapper').html(h);
		// 		}
	
				
		// 		// if (_.checkAccess(self.role,'ShowDeleteChat')) {
		// 		// 	self.$el.find('.delete').show();
		// 		// } else {
		// 		// 	self.$el.find('.delete').hide();
		// 		// }
		// 		// if (_.checkAccess(self.role,'HidePinChat')) {
		// 		// 	self.$el.find('.pin').hide();
		// 		// }
		// 	})
		// 	.always(function() {
		// 		if ($('.scrollable').css('opacity') === '0') {
		// 			$('.scrollable').css('opacity','1');
		// 			$('.scrollable')[0].scrollTop = $('.scrollable')[0].scrollHeight;
		// 		} else {
		// 			scrollToBottom();
		// 		}
		// 		// MainView.periodic(self,self.getMessage,5000);
		// 	})
		// 	.done(function() {
		// 		if(templatesFlag === false) getTemplates();
		// 		togglePin();
		// 	});
		// }
	});
});