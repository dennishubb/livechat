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
	var chat_id = '';

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
					chat_id = data.chat.id;
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
					// if (m.message.includes('@endChat') && m.last_message_user_id !== user_id) {
					// 	h = h.replaceAll('@endChat','');
					// 	h+= '<div class="chat-ended">Chat ended</div>';
					// 	endChat(m.id);
					// }
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

		$(document).on('focus', 'textarea', function(e){
			$('textarea').trigger('input');
			setTimeout(function() {
				$('textarea').trigger('input');
			},300);
		});

		$(document).on('input', 'textarea', function(e){
			e.currentTarget.style.height = '0px';
			e.currentTarget.style.height = (e.currentTarget.scrollHeight)+'px';
			var tmp = $('.chat-tools').height();
			$('.scrollable').css('height','calc(100% - '+tmp+'px)');
			scrollToBottom(true);
		});

		$(document).on('click', '.message img', function(e){
			window.open($(e.currentTarget).attr('src'));
		});

		$(document).on('click', '.send', function(e){

			var message = $('textarea').val();
			if (message) {
				$.post('http://api.livechat.com/v1/chats/messages/insert', {merchant_id:merchant_id,user_id:user_id,chat_id:chat_id,message:message}, function() {
					$('textarea').val('');
					getMessage();
				});
			}

			// var self = this;
			// var message = $('textarea').val();
			// var stranger = User.get('id') ? false : true;
			// if (message) {
			// 	var data = {message:message};
			// 	var completed = function() {
			// 		$.post('/chat/send', data, function(res) {
			// 			if (stranger && res && res.id && res.token) {
			// 				User.clear({silent:true}).set(res).saveLocal();
			// 				User.syncData(function() {
			// 					self.render();
			// 				});
			// 			} else {
			// 				self.loadMessages();
			// 				$textarea.val('').trigger('input');
			// 			}
			// 		});
			// 	};
			// 	if (stranger) {
			// 		MainView.showCaptcha(function(captchaOutput) {
			// 			data['captchaOutput'] = captchaOutput;
			// 			completed();
			// 		});
			// 	} else {
			// 		completed();
			// 	}
			// }
		});
		
		// 	'change input[name="file"]': function(e) {
		// 		var self = this;
		// 		var data = new FormData();
		// 		var stranger = User.get('id') ? false : true;
		// 		if (e.target.files.length) {
		// 			_.each(e.target.files, function(value) {
		// 				data.append('file', value);
		// 			});
		// 			var completed = function() {
		// 				$.ajax({
		// 					url: '/chat/send',
		// 					data: data,
		// 					processData: false,
		// 					contentType: false,
		// 					type: 'POST',
		// 					success: function(res) {
		// 						if (stranger && res && res.id && res.token) {
		// 							User.clear({silent:true}).set(res).saveLocal();
		// 							User.syncData(function() {
		// 								self.render();
		// 							});
		// 						} else {
		// 							self.loadMessages();
		// 							e.target.value = '';
		// 						}
		// 					}
		// 				});
		// 			};
		// 			if (stranger) {
		// 				MainView.showCaptcha(function(captchaOutput) {
		// 					data.append('captchaOutput', captchaOutput);
		// 					completed();
		// 				});
		// 			} else {
		// 				completed();
		// 			}
		// 		}
		// 	},
		// 	'click .tips-container': function(e) {
		// 		var self = this;
		// 		MainView.tips({chatData:self.chatData});
		// 	},
		// 	'click .copy-text': function(e) {
		// 		var $this = $(e.currentTarget);
		// 		if(_.settingConfig('disableCopyChat')){
		// 			return;
		// 		}
		// 		var textContent = $this.find('span.text').text();
		// 		navigator.clipboard.writeText(textContent);
		// 	},
		// }
	});
});