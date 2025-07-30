require(['jquery', 'underscore', 'lib/moment.min', 'autolinker'], function($,_,moment,Autolinker){
	$(function() {
		$('head').append('<link rel="stylesheet" type="text/css" href="/views/message/messages.css">');

		const request = new URLSearchParams(
			{
				merchant_id: merchant_id, 
				chat_id: chat_id
			}
		).toString();

		$.get('http://api.livechat.com/v1/chats/messages/get', request, function(response){
			const resp = JSON.parse(response);

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
							'<p class="text">'+self.showMessage(m.message)+'</p>'+
						'</div>';
				});
				$('.action.profile').html(player_name);
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
		}).always(function() {
			if ($('.scrollable').css('opacity') === '0') {
				$('.scrollable').css('opacity','1');
				$('.scrollable')[0].scrollTop = $('.scrollable')[0].scrollHeight;
			} else {
				scrollToBottom();
			}
			// MainView.periodic(self,self.getMessage,5000);
		});

		/**			if (data.templates) {
				var orderChat = Object.fromEntries(Object.entries(data.templates).sort())
				self.templates = orderChat;
				loadTemplates();
			} */
	
		function getTemplates() {

			const request = new URLSearchParams(
				{
					merchant_id: merchant_id,
					user_id : user_id
				}
			).toString();
	
			$.get('http://api.livechat.com/v1/chats/templates/get', request, function(response){
				const resp = JSON.parse(response);
	
				console.log(resp);
			});
			
			// var self = this;
			// var templates = [];
			// var shortcuts = [];
			// _.each(self.templates, function(v,k) {
			// 	if (k && k.length && k.substring(0,2) === '++') {
			// 		shortcuts.push(k.substring(2));
			// 	} else {
			// 		templates.push(k);
			// 	}
			// });
			// if (_.checkAccess(User.get('role'),'HideChatTool')) {
			// 	self.$el.find('.chat-tools').remove();
			// }
			// if (shortcuts.length) {
			// 	shortcuts.sort();
			// 	self.$el.find('.shortcuts').html(_.reduce(shortcuts, function(h,v) { return h+'<div class="shortcut" data-key="'+v+'">'+v+'</div>'; }, '')).show();
			// }
			// if (templates.length) {
			// 	self.$el.find('[name="template"]').html(_.reduce(templates, function(h,v) { return h+'<option>'+v+'</option>'; }, '<option value="">(Select Template)</option>')+'<option>(Edit Template)</option>');
			// }
			// if (_.checkAccess(self.role,'HideEditTemplate')) {
			// 	self.$el.find('select option:last').remove();
			// }
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
		
		// toggleTemplate: function() {
		// 	var self = this;
		// 	var $textarea = self.$el.find('textarea');
		// 	if ($textarea.val()) {
		// 		self.$el.find('.chat-tools').addClass('typing');
		// 	} else {
		// 		self.$el.find('.chat-tools').removeClass('typing');
		// 	}
		// },
		
		// events: {
		// 	'click .shortcut': function(e) {
		// 		var self = this;
		// 		var $this = $(e.currentTarget);
		// 		var key = '++'+$this.data('key');
		// 		var $textarea = self.$el.find('textarea');
		// 		$textarea.val(self.templates[key]);
		// 		self.$el.find('.send.default').trigger('click');
		// 	},
		// 	'change [name="template"]': function(e) {
		// 		var self = this;
		// 		var $this = $(e.currentTarget);
		// 		var $textarea = self.$el.find('textarea');
		// 		if ($this.val() === '(Edit Template)') {
		// 			self.goTo('template', {trigger:true});
		// 		}
		// 		$textarea.val(self.templates[$this.val()]);
		// 		self.toggleTemplate();
		// 		$this.val('');
		// 	},
		// 	'keyup textarea': function(e) {
		// 		var code = (e.keyCode ? e.keyCode : e.which);
		// 		if (code === 13 && !event.shiftKey) {
		// 			e.preventDefault();
		// 			this.$el.find('.send.default').trigger('click');
		// 		} else {
		// 			this.toggleTemplate();
		// 		}
		// 	},
		// 	'focus textarea': function(e) {
		// 		this.$el.find('.chat-tools').addClass('focus');
		// 	},
		// 	'blur textarea': function(e) {
		// 		this.$el.find('.chat-tools').removeClass('focus');
		// 	},
		// 	'click .message img': function(e) {
		// 		window.open($(e.currentTarget).attr('src'));
		// 	},
		// 	'click .profile': function(e) {
		// 		var self = this;
		// 		new ProfileView({mamId:self.mamId,user:self.user}).render();
		// 	},
		// 	'click .pin': function(e) {
		// 		var self = this;
		// 		var $this = $(e.currentTarget);
		// 		var setPin = $this.data('setpin');
		// 		$.post('/chat/pin', {mamId:self.mamId,userId:self.userId,setPin:setPin}, function () {
		// 			self.getPin = 1;
		// 			self.getMessage();
		// 		});
		// 	},
		// 	'mousedown .send': function(e) {
		// 		var self = this;
		// 		self.pressSendTimer = window.setTimeout(function() {
		// 			self.$el.find('.send.default').toggle();
		// 			self.$el.find('.send.whatsapp').toggle();
		// 		},1000);
		// 	},
		// 	'touchstart .send': function(e) {
		// 		var self = this;
		// 		self.pressSendTimer = window.setTimeout(function() {
		// 			self.$el.find('.send.default').toggle();
		// 			self.$el.find('.send.whatsapp').toggle();
		// 		},1000);
		// 	},
		// 	'touchend .send': function(e) {
		// 		var self = this;
		// 		clearTimeout(self.pressSendTimer);
		// 	},
		// 	'click .send': function(e) {
		// 		var self = this;
		// 		clearTimeout(self.pressSendTimer);
		// 		var $textarea = self.$el.find('textarea');
		// 		var message = $textarea.val();
		// 		var whatsapp = self.$el.find('.send.whatsapp').is(':visible') ? 2 : 0;
		// 		if (message) {
		// 			$.post('/chat/send', {mamId:self.mamId,userId:self.userId,message:message,whatsapp:whatsapp}, function() {
		// 				$textarea.val('');
		// 				self.getMessage();
		// 				self.toggleTemplate();
		// 			});
		// 		}
		// 	},
		// 	'change input[name="file"]': function(e) {
		// 		var self = this;
		// 		var data = new FormData();
		// 		if (e.target.files.length) {
		// 			data.append('module','/chat/send');
		// 			data.append('mamId',self.mamId);
		// 			data.append('userId',self.userId);
		// 			_.each(e.target.files, function(value) {
		// 				data.append('file',value);
		// 			});
		// 			MainView.showLoad(true);
		// 			User.fetch({
		// 				noset: true,
		// 				data: data,
		// 				processData: false,
		// 		        contentType: false,
		// 				success: function(model,data,options) {
		// 					if (options.apiStatus === 'SUCCESS') {
		// 						self.getMessage();
		// 					}
		// 				},
		// 				complete: function() {
		// 					e.target.value = '';
		// 					MainView.showLoad(false);
		// 				}
		// 			});
		// 		}
		// 	},
		// 	'click .voicestart': function(e) {
		// 		var self = this;
		// 		var $this = $(e.currentTarget);
		// 		if (Recorder.isRecordingSupported() && !$this.hasClass('disabled')) {
		// 			if (typeof window.voiceRecorder === 'undefined') {
		// 				window.voiceRecorder = new Recorder({encoderPath:'https://static.gwvkyk.com/mobile/encoder-worker/encoderWorker.min.js'});
		// 			}
		// 			window.voiceRecorder.ondataavailable = function(typedArray) {
		// 				var dataBlob = new Blob([typedArray],{type:'audio/ogg'});
		// 				var reader = new FileReader();
		// 				reader.onloadend = function() {
		// 					if (self.voicesend) {
		// 						console.log(reader.result);
		// 						$.post('/chat/send', {mamId:self.mamId,userId:self.userId,message:reader.result}, function() {
		// 							self.getMessage();
		// 						});
		// 					}
		// 				}
		// 				reader.readAsDataURL(dataBlob);
		// 			};
		// 			window.voiceRecorder.start();
		// 			self.$el.find('.voice a').toggleClass('disabled');
		// 		}
		// 	},
		// 	'click .voicesend, .voicecancel': function(e) {
		// 		var self = this;
		// 		var $this = $(e.currentTarget);
		// 		if (!$this.hasClass('disabled')) {
		// 			if ($this.hasClass('voicesend')) {
		// 				self.voicesend = 1;
		// 			} else {
		// 				self.voicesend = 0;
		// 			}
		// 			window.voiceRecorder.stop();
		// 			self.$el.find('.voice a').toggleClass('disabled');
		// 		}
		// 	},
		// 	'click .delete': function(e) {
		// 		var self = this;
		// 		var messageId = $(e.currentTarget).data('id');
		// 		_.confirm('Are you sure to delete?', function() {
		// 			$.post('/chat/deleteMessage', {mamId:self.mamId,id:messageId}, function() {
		// 				self.getMessage();
		// 			});
		// 		});
		// 	}
		// }
	});
});