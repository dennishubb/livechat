require(['jquery', 'underscore', 'lib/moment.min', 'lib/Autolinker.min', 'lib/recorder.min'], function($,_,moment,Autolinker,Recorder){

	var full_templates = [];
	var templates = [];
	var shortcuts = [];
	var template_id = 0;
	var pressSendTimer;
	var templatesFlag = false;
	var voicesend = 0;

	$(function() {
		$('head').append('<link rel="stylesheet" type="text/css" href="/views/message/messages.css">');

		const request = new URLSearchParams(
			{
				merchant_id: merchant_id, 
				chat_id: chat_id
			}
		).toString();

		getMessage();

		function getMessage(){
			$.get('http://api.livechat.com/v1/chats/messages/get', request, function(response){
				const resp = JSON.parse(response);
	
				console.log(resp);
	
				if(resp.status === 200){
					const data = resp.data;
	
					const player_id = data.chat.user_id;
					const player_name = data.chat.user_name;
					const pin_id = data.chat.pin_id;
					var today = moment().format('D MMM YYYY ');
					var h = '';
					_.each(data.messages.reverse(), function(m) {
						var createdDateTime = moment(m.created_at);
						
						h+= '<div class="message '+(m.user_id !== player_id ? (m.user_id === 1002 ? 'myself' : 'staff') : 'customer')+'">'+
								'<p class="btn danger delete fa fa-trash-o" data-id="'+m.id+'"></p>'+
								'<p class="time">'+createdDateTime.format('D MMM YYYY h:mma').replace(today,'')+'</p>'+
								'<p class="channel '+showChannel(m)+' '+(m.status || '')+'">'+showChannel(m)+'</p>'+
								'<p class="name">'+(m.user_id !== player_id ? m.name : '<span class="profile"><i class="fa fa-user"></i>'+player_name+'</span>')+'</p>'+
								'<p class="text">'+showMessage(m.message)+'</p>'+
							'</div>';
					});
					// $('.action.profile').html(player_name);
					$('.wrapper').html(h);
	
					if (pin_id === 0) {
						$('.pin').hide();
						$('.pin[data-setpin="0"]').show();
					}else{
						$('.pin').show();
						$('.pin[data-setpin="0"]').hide();
					}
				}
	
				
				// if (_.checkAccess(self.role,'ShowDeleteChat')) {
				// 	self.$el.find('.delete').show();
				// } else {
				// 	self.$el.find('.delete').hide();
				// }
				// if (_.checkAccess(self.role,'HidePinChat')) {
				// 	self.$el.find('.pin').hide();
				// }
			})
			.always(function() {
				if ($('.scrollable').css('opacity') === '0') {
					$('.scrollable').css('opacity','1');
					$('.scrollable')[0].scrollTop = $('.scrollable')[0].scrollHeight;
				} else {
					scrollToBottom();
				}
				// MainView.periodic(self,self.getMessage,5000);
			})
			.done(function() {
				if(templatesFlag === false) getTemplates();
			});
		}
	
		function getTemplates() {

			const request = new URLSearchParams(
				{
					merchant_id: merchant_id,
					user_id : 1002
				}
			).toString();
	
			$.get('http://api.livechat.com/v1/chats/templates/get', request, function(response){
				const resp = JSON.parse(response);
	
				console.log(resp);

				if(resp.status === 200){
					const data = resp.data;

					full_templates = data.templates;

					_.each(data.templates, function(v,k) {
						if (k && k.length && k.substring(0,2) === '++') {
							shortcuts.push(k.substring(2));
						} else {
							templates.push(k);
						}
					});

					// if (_.checkAccess(User.get('role'),'HideChatTool')) {
					// 	self.$el.find('.chat-tools').remove();
					// }
					if (shortcuts.length) {
						shortcuts.sort();
						$('.shortcuts').html(_.reduce(shortcuts, function(h,v) { return h+'<div class="shortcut" data-key="'+v+'">'+v+'</div>'; }, '')).show();
					}
					if (templates.length) {
						$('[name="template"]').html(_.reduce(templates, function(h,v) { return h+'<option>'+v+'</option>'; }, '<option value="">(Select Template)</option>')+'<option>(Edit Template)</option>');
					}
					// if (_.checkAccess(self.role,'HideEditTemplate')) {
					// 	self.$el.find('select option:last').remove();
					// }
				}
			})
			.done(function(){
				templatesFlag = true;
			});
		}
		
		function showMessage(message) {
			var fname = '';
			var tmp = message.split('?')[0].split('#')[0].split('/');
			if (tmp.length > 1) {
				fname = tmp[tmp.length-1];
			}
			if (message.indexOf('firebasestorage') > 0) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (fname.indexOf('.jpg') > 0 || fname.indexOf('.png') > 0 || fname.indexOf('.gif') > 0)) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (fname.indexOf('.ogg') > 0)) {
				message = '<audio controls><source src="'+message+'" type="audio/ogg"></audio>';
			} else {
				//message = _.Autolinker(message.replace(/(?:\r\n|\r|\n)/g, '<br>'));
				message = Autolinker.link(message.replace(/(?:\r\n|\r|\n)/g, '<br>'));
				var divTemp = document.createElement('div');
				divTemp.innerHTML = message;
				message = divTemp.innerHTML;
			}
			return message;
		}
		
		function showChannel(m) {
			var channel = 'NOSEND';
			if (m.source === 'VIBER') {
				channel = 'VIBER';
			} else if (m.source === 'LINE') {
				channel = 'LINE';
			} else if (m.source === 'TELEGRAM') {
				channel = 'TELEGRAM';
			} else if (m.admin) {
				if (m.source === 'LIVECHAT') {
					channel = 'LIVECHAT';
				} else if (m.status === 'SENT') {
					channel = 'WHATSAPP';
				} else if (m.status === 'SMS') {
					channel = 'SMS';
				}
			} else {
				if (m.source === 'LIVECHAT') {
					channel = 'LIVECHAT';
				} else {
					channel = 'WHATSAPP';
				}
			}
			return channel;
		}
		
		function scrollToBottom() {
			if ($('.scrollable')[0].scrollTop + $('.scrollable').height() + 200 >= $('.scrollable')[0].scrollHeight) {
				setTimeout(function() {
					$('.scrollable').animate({scrollTop:$('.wrapper').height()}, 300);
				},500);
			}
		};
		
		function toggleTemplate() {
			var textarea = $('textarea');
			if (textarea.val()) {
				$('.chat-tools').addClass('typing');
			} else {
				$('.chat-tools').removeClass('typing');
			}
		};

		$(document).on('click', '.shortcut', function(e){
			var key = '++'+$(e.currentTarget).data('key');
			$('textarea').val(full_templates[key].message);
			$('.send.default').trigger('click');
			template_id = full_templates[key].id;
		});

		$(document).on('change', '[name="template"]', function(e){
			if (e.currentTarget.val() === '(Edit Template)') {
				window.location.href = 'backoffice.livechat.com/templates/5';
				// self.goTo('template', {trigger:true});
			}
			$('.textarea').val(full_templates[$(e.currentTarget).val()].message);
			toggleTemplate();
			$(e.currentTarget).val('');
		});

		$(document).on('keyup', 'textarea', function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code === 13 && !e.shiftKey) {
				e.preventDefault();
				$('.send.default').trigger('click');
			} else {
				toggleTemplate();
			}
		});

		$(document).on('focus', 'textarea', function(e){
			$('.chat-tools').addClass('focus');
		});

		$(document).on('blur', 'textarea', function(e){
			$('.chat-tools').removeClass('focus');
		});

		$(document).on('click', '.message img', function(e){
			window.open($(e.currentTarget).attr('src'));
		});

		$(document).on('click', '.pin', function(e){
			var pin_id = $(e.currentTarget).data('setpin');
			$.post('http://api.livechat.com/v1/chats/pin', {chat_id: chat_id,pin_id:pin_id}, function (resp) {
				console.log(resp);
				// self.getPin = 1;
				// self.getMessage();
			});
		});

		$(document).on('mousedown', '.send', function(e){
			pressSendTimer = window.setTimeout(function() {
				$('.send.default').toggle();
				$('.send.whatsapp').toggle();
			},1000);
		});

		$(document).on('touchstart', '.send', function(e){
			pressSendTimer = window.setTimeout(function() {
				$('.send.default').toggle();
				$('.send.whatsapp').toggle();
			},1000);
		});

		$(document).on('touchend', '.send', function(e){
			clearTimeout(pressSendTimer);
		});	

		$(document).on('click', '.send', function(e){
			clearTimeout(pressSendTimer);
			var message = $('textarea').val();
			var whatsapp = $('.send.whatsapp').is(':visible') ? 2 : 0;
			if (message) {
				$.post('http://api.livechat.com/v1/chats/messages/insert', {merchant_id:merchant_id,user_id:1002,chat_id:chat_id,message:message,whatsapp:whatsapp}, function() {
					$('textarea').val('');
					getMessage();
					toggleTemplate();
				});
			}
		});	

		$(document).on('change', 'input[name="file"]', function(e){
			var self = this;
			var data = new FormData();
			console.log("file");
			// if (e.target.files.length) {
			// 	data.append('module','/chats/messages/insert');
			// 	data.append('mamId',self.mamId);
			// 	data.append('userId',self.userId);
			// 	_.each(e.target.files, function(value) {
			// 		data.append('file',value);
			// 	});
			// 	MainView.showLoad(true);
			// 	User.fetch({
			// 		noset: true,
			// 		data: data,
			// 		processData: false,
			// 		contentType: false,
			// 		success: function(model,data,options) {
			// 			if (options.apiStatus === 'SUCCESS') {
			// 				getMessage();
			// 			}
			// 		},
			// 		complete: function() {
			// 			e.target.value = '';
			// 			MainView.showLoad(false);
			// 		}
			// 	});
			// }
		});	

		$(document).on('click', '.voicestart', function(e){
			if (Recorder.isRecordingSupported() && !$(e.currentTarget).hasClass('disabled')) {
				if (typeof window.voiceRecorder === 'undefined') {
					window.voiceRecorder = new Recorder({encoderPath:'https://static.gwvkyk.com/mobile/encoder-worker/encoderWorker.min.js'});
				}
				window.voiceRecorder.ondataavailable = function(typedArray) {
					var dataBlob = new Blob([typedArray],{type:'audio/ogg'});
					var reader = new FileReader();
					reader.onloadend = function() {
						if (voicesend) {
							console.log(reader.result);
							// $.post('/chats/messages/insert', {mamId:self.mamId,userId:self.userId,message:reader.result}, function() {
							// 	getMessage();
							// });
						}
					}
					reader.readAsDataURL(dataBlob);
				};
				window.voiceRecorder.start();
				$('.voice a').toggleClass('disabled');
			}
		});	

		$(document).on('click', '.voicesend, .voicecancel', function(e){
			if (!$(e.currentTarget).hasClass('disabled')) {
				if ($(e.currentTarget).hasClass('voicesend')) {
					voicesend = 1;
				} else {
					voicesend = 0;
				}
				window.voiceRecorder.stop();
				$('.voice a').toggleClass('disabled');
			}
		});	

		$(document).on('click', '.delete', function(e){
			console.log("delete");
			var self = this;
			var messageId = $(e.currentTarget).data('id');
			_.confirm('Are you sure to delete?', function() {
				$.post('/chats/messages/delete', {merchant_id:merchant_id,message_id:messageId}, function() {
					self.getMessage();
				});
			});
			$('.voice a').toggleClass('disabled');
		});	
	});
});