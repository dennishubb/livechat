define(function(require) {
	
	var Backbone	= require('backbone'),
		User		= require('models/User'),
		tpl			= require('text!views/chatroom/chatroom.html');
	
	return Backbone.View.extend({
		
		id: 'chatroom',
		
		initialize: function(options) {
			
			this.template = _.template(tpl);
			this.text = options.text;
			
		},
		
		render: function() {
			
			var self = this;
			
			if (_.deepGet(JSON.parse(_.config('ContactUs')),'replaceLiveChat')) {
				router.goTo('contact', {replace:true});
				return false;
			}
			
			self.$el.html(self.template({livechatPromo:_.deepGet(_.getVar('publicInfo'),'livechatPromo')}));
			
			self.$scrollable = self.$el.find('.scrollable');
			self.$wrapper = self.$el.find('.wrapper');
			
			MainView.changeRoute(self);

			$('#chat-count').remove();
			
			if (User.get('id')) {
				self.loadMessages();
			} else {
				self.$scrollable.css('visibility','visible');
			}

			if (self.text) {
				self.$el.find('textarea').val(self.text);
			}
			
			return this;
		},
		
		loadMessages: function(loadType) {
			var self = this;
			console.log('/chat/getMessage');
			$.ajax({
				type: 'POST',
				url: '/chat/getMessage',
				data: {background: loadType === 'periodic' ? 1 : 0},
				success: function(data) {
					self.chatData = data.messages;
					self.showMessage(data.messages);
				},
				complete: function() {
					self.scrollToBottom();
					MainView.periodic(self,self.loadMessages,5000);
				}
			});
		},
		
		showMessage: function(messages) {
			var self = this;
			var userName = User.get('name');
			var today = moment().format('D MMM YYYY');
			var lastCreatedDateTime = '';
			var lastMsgTime = '';
			var h = '';
			var aR = false; // adminResponse
			_.each(messages.reverse(), function(m) {
				if (m.status !== 'DELETED') {
					var createdDateTime = moment(m.createdDateTime);
					if (lastCreatedDateTime === '' || createdDateTime.diff(lastCreatedDateTime) > 600000) {
						var msgDate = createdDateTime.format('D MMM YYYY');
						var msgTime = msgDate === today ? createdDateTime.format('h:mma') : msgDate;
						if (msgTime !== lastMsgTime) {
							lastMsgTime = msgTime;
							h+= '<div class="time">'+msgTime+'</div>';
						}
						lastCreatedDateTime = createdDateTime;
					}
					h+= '<div class="message '+(m.admin ? 'staff' : 'myself')+'">'+
							'<div class="message-wrapper copy-text">'+
								'<span class="name">'+(m.admin ? _.adminRename(m.admin) : userName)+'</span>'+
								'<span class="copy fa fa-copy"></span>'+
								'<span class="text">'+self.getMessageHtml(m.message)+'</span>'+
							'</div>'+
						'</div>';
					if (m.message.includes('@endChat') && m.admin) {
						h = h.replaceAll('@endChat','');
						h+= '<div class="chat-ended">Chat ended</div>';
						self.endChat(m.id);
					}
					if(_.config('TipStaff') && m.admin && m.admin.id) {
						aR = true;
					}
				}
			});
			if (h) {
				var chatToolHeight = self.$el.find('.chat-tools').height();
				if(aR) {
					var tipsContainerHeight = self.$el.find('.tips-container').height() || chatToolHeight;
					self.$el.find('.tips-container').show();
					self.$el.find('.scrollable').css('height','calc(100% - '+(chatToolHeight+tipsContainerHeight)+'px)');
				} else {
					self.$el.find('.tips-container').hide();
					self.$el.find('.scrollable').css('height','calc(100% - '+chatToolHeight+'px)');
				}
				if (self.prevHTML !== h) {
					self.prevHTML = h;
					self.$el.find('.wrapper').html(h);
				}
			}
		},
		
		getMessageHtml: function(message) {
			var self = this;
			if (message.indexOf('firebasestorage') > 0) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (message.indexOf('.jpg') > 0 || message.indexOf('.png') > 0 || message.indexOf('.gif') > 0)) {
				message = '<img src="'+message+'">';
			} else if (message.indexOf('http') === 0 && (message.indexOf('.ogg') > 0)) {
				message = '<audio controls><source src="'+message+'" type="audio/ogg"></audio>';
			} else {
				message = _.Autolinker(message.replace(/(?:\r\n|\r|\n)/g, '<br>'));
			}
			return message;
		},
		
		scrollToBottom: function(force) {
			var self = this;
			var hidden = false;
			if (self.$scrollable.css('visibility') === 'hidden') {
				hidden = true;
				self.$scrollable.css('visibility','visible');
			}
			if (force || hidden || self.$scrollable[0].scrollTop + self.$scrollable.height() + 200 >= self.$scrollable[0].scrollHeight) {
				self.$scrollable.scrollTop(self.$wrapper.height());
			}
		},

		endChat: function(mId) {
			var self = this;
			var lastEndChatId = parseInt(_.getLocalStorage('lastEndChatId')) || 0;
			if (parseInt(mId) > lastEndChatId) {
				_.setLocalStorage('lastEndChatId',mId);
				self.$el.find('.tips-container').click();
			}
		},
		
		events: {
			'focus textarea': function(e) {
				var self = this;
				self.$el.find('textarea').trigger('input');
				setTimeout(function() {
					self.$el.find('textarea').trigger('input');
				},300);
			},
			'input textarea': function(e) {
				e.currentTarget.style.height = '0px';
				e.currentTarget.style.height = (e.currentTarget.scrollHeight)+'px';
				var tmp = this.$el.find('.chat-tools').height() + this.$el.find('.tips-container').height();
				this.$scrollable.css('height','calc(100% - '+tmp+'px)');
				this.scrollToBottom(true);
			},
			'click .message img': function(e) {
				window.open($(e.currentTarget).attr('src'));
			},
			'click .send': function(e) {
				var self = this;
				var $textarea = self.$el.find('textarea');
				var message = $textarea.val();
				var stranger = User.get('id') ? false : true;
				if (message) {
					var data = {message:message};
					var completed = function() {
						$.post('/chat/send', data, function(res) {
							if (stranger && res && res.id && res.token) {
								User.clear({silent:true}).set(res).saveLocal();
								User.syncData(function() {
									self.render();
								});
							} else {
								self.loadMessages();
								$textarea.val('').trigger('input');
							}
						});
					};
					if (stranger) {
						MainView.showCaptcha(function(captchaOutput) {
							data['captchaOutput'] = captchaOutput;
							completed();
						});
					} else {
						completed();
					}
				}
			},
			'change input[name="file"]': function(e) {
				var self = this;
				var data = new FormData();
				var stranger = User.get('id') ? false : true;
				if (e.target.files.length) {
					_.each(e.target.files, function(value) {
						data.append('file', value);
					});
					var completed = function() {
						$.ajax({
							url: '/chat/send',
							data: data,
							processData: false,
							contentType: false,
							type: 'POST',
							success: function(res) {
								if (stranger && res && res.id && res.token) {
									User.clear({silent:true}).set(res).saveLocal();
									User.syncData(function() {
										self.render();
									});
								} else {
									self.loadMessages();
									e.target.value = '';
								}
							}
						});
					};
					if (stranger) {
						MainView.showCaptcha(function(captchaOutput) {
							data.append('captchaOutput', captchaOutput);
							completed();
						});
					} else {
						completed();
					}
				}
			},
			'click .tips-container': function(e) {
				var self = this;
				MainView.tips({chatData:self.chatData});
			},
			'click .copy-text': function(e) {
				var $this = $(e.currentTarget);
				if(_.settingConfig('disableCopyChat')){
					return;
				}
				var textContent = $this.find('span.text').text();
				navigator.clipboard.writeText(textContent);
			},
		}
	});
});