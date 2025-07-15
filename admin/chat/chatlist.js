define(function(require) {
	
	var Backbone	= require('backbone'),
		tpl			= require('text!views/chatlist/chatlist.html');
	
	return Backbone.View.extend({
		
		id: 'chatlist',
		
		initialize: function(options) {
			
			this.template = _.template(tpl);
			this.maCreatedDateTime = {};
			this.maPinChatDateTime = {};
			this.chats = [];
			this.role = User.get('role');
			this.pintype = _.getLocalStorage('PINTYPE');
			if (this.pintype === null) {
				this.pintype = 'ALL';
			}

		},
		
		render: function() {
			
			var self = this;
			
			self.$el.html(self.template({}));

			self.$el.find('.pin-type[data-type="'+self.pintype+'"]').addClass('selected');
			
			MainView.changeRoute(self);
			
			self.getChats();
			self.toggleButtonState();
			
			self.listenTo(MainView, 'newmessage', function() {
				if (document.body.contains(self.el)) {
					self.getChats('periodic');
				}
			});
			
			return this;
		},
		
		getChats: function(periodic) {
			var self = this;
			clearTimeout(self.getChatsTimeoutID);
			self.getChatsTimeoutID = setTimeout(function() {
				console.log('/chat/getChats');
				$.post('/chat/getChats', {
					background: periodic === 'periodic' ? 1 : 0,
					maCreatedDateTime: JSON.stringify(self.maCreatedDateTime),
					maPinChatDateTime: JSON.stringify(self.maPinChatDateTime)
				}, function(data) {
					data = _.filter(data, function(c){ return c.user && c.user.id; });
					if (!(data && data.length)) {
						return;
					}
					var cuIds = [];
					_.each(data, function(c) {
						cuIds.push(c.user.id);
						if (typeof self.maCreatedDateTime[c.user.merchantId] === 'undefined') {
							self.maCreatedDateTime[c.user.merchantId] = '';
						}
						if (typeof self.maPinChatDateTime[c.user.merchantId] === 'undefined') {
							self.maPinChatDateTime[c.user.merchantId] = '';
						}
						if (c.createdDateTime > self.maCreatedDateTime[c.user.merchantId]) {
							self.maCreatedDateTime[c.user.merchantId] = c.createdDateTime;
						}
						if (c.pinChatDateTime > self.maPinChatDateTime[c.user.merchantId]) {
							self.maPinChatDateTime[c.user.merchantId] = c.pinChatDateTime;
						}
					});
					var oChats = _.filter(self.chats, function(c){ return cuIds.indexOf(c.user.id) < 0; });
					if (oChats && oChats.length) {
						data = data.concat(oChats);
						self.chats = data.slice(0,200);
					} else {
						self.chats = data;
					}
					self.renderList();
				}).always(function() {
					MainView.periodic(self,self.getChats,10000);
				});
			},300);
		},
		
		renderList: function() {
			var self = this;
			var today = moment().format('D MMM YYYY');
			var h = '';
			_.each(self.sortList(self.chats), function(m) {
				if (self.pintype !== 'ALL' && self.pintype !== parseInt(m.pinned)) {
					return;
				}
				var username = m.user.name;
				var displayTime = moment(m.createdDateTime);
				if (displayTime.format('D MMM YYYY') === today) {
					displayTime = displayTime.format('h:mm A');
				} else {
					displayTime = displayTime.format('D MMM');
				}
				h+= '<a class="chat '+self.chatStatus(m)+'" data-mam-id="'+m.user.merchantId+'" data-id="'+m.user.id+'" href="#chatroom/'+m.user.id+'/'+m.user.merchantId+'">'+
						'<p class="time">'+displayTime+'</p>'+
						'<p class="name">'+m.user.name+'</p>'+
						'<p class="text">'+m.message.replace(/(?:\r\n|\r|\n|(<([^>]+)>))/g, ' ')+'</p>'+
						'<i class="fa fa-exclamation-circle exclamation"></i>'+
						'<span class="pin" data-setpin="'+(m.pinned ? 0 : 1)+'">PIN</span>'+
					'</a>';
			});
			self.$el.find('.wrapper').html(h);
			if (_.checkAccess(self.role,'HidePinChat')) {
				self.$el.find('.pin').remove();
			}
		},
		
		sortList: function(chats) {
			self = this;
			var cs = _.config('ChatSort');
			if (cs) {
				chats = _.sortBy(chats, function(m) {
					var s = self.chatStatus(m);
					var a = {'red':2,'orange':3,'':4};
					var b = 'Z';
					if (cs === 1 && m.user && m.user.class) {
						b = m.user.class[0];
						if (b === 'N') {
							b = m.user.class[1];
						}
					}
					return a[s]+b;
				});
			}
			chats = _.sortBy(chats, function(m) {
				if (self.chatStatus(m) === 'pinned') {
					return 'pinned';
				} else if (self.chatStatus(m) === 'yellow') {
					return 'yellow';
				}
			});
			return chats;
		},
		
		chatStatus: function(m) {
			if (parseInt(m.pinned)) {
				if (m.admin) {
					return 'pinned';
				}
				return 'yellow';
			}
			if (m.admin) {
				return '';
			}
			var msgtype = '';
			if (m.message && m.message.length) {
				if (_.isReferrerCode(m.message)) {
					msgtype = 'RF';
				} else if (m.message === 'Join') {
					msgtype = 'JOIN';
				}
			}
			var color = _.deepGet(_.config('ChatColor'),msgtype);
			if (color === 0) {
				return '';
			}
			if (color !== 1 && (['WhatsAppOnlyNoReply','WhatsAppOnlyNoReplySMS'].includes(_.conf('SignUpMethod')) || _.config('ChatSort') === 1) && ['RF','JOIN'].includes(msgtype)) {
				return '';
			}
			var sec = parseInt(moment().diff(m.createdDateTime,'seconds'));
			if ([48].indexOf(_.getVar('merchantId')) >= 0 && sec >= 5) {
				return 'red';
			} else if ([62,170].indexOf(_.getVar('merchantId')) >= 0 && sec >= 10) {
				return 'red';
			} else if ([6].indexOf(_.getVar('merchantId')) >= 0 && sec >= 60) {
				return 'red';
			} else if ([195].indexOf(_.getVar('merchantId')) >= 0 && sec >= 120) {
				return 'red';
			} else if (sec >= 180) {
				return 'red';
			}
			return 'orange';
		},

		toggleButtonState: function() {
			var playSound = _.getLocalStorage('CHATSOUND');
			var btn = $('.chat-sound');
			playSound === 'off' ? btn.text('Sound Off') : btn.text('Sound On');
		},

		events: {
			'click .pin-type': function(e) {
				var self = this;
				var $this = $(e.currentTarget);
				$this.addClass('selected').siblings().removeClass('selected');
				self.pintype = $this.data('type');
				_.setLocalStorage('PINTYPE',self.pintype);
				self.renderList();
			},
			'click .pin': function(e) {
				var self = this;
				e.stopPropagation();
				e.preventDefault();
				var $this = $(e.currentTarget);
				var mamId = parseInt($this.closest('a.chat').data('mam-id')) || '';
				var userId = parseInt($this.closest('a.chat').data('id'));
				var setPin = $this.data('setpin');
				if (mamId && userId) {
					$.post('/chat/pin', {mamId:mamId,userId:userId,setPin:setPin}, function () {
						self.maCreatedDateTime[mamId] = '';
						self.getChats();
					});
				}
			},
			'click .chat-sound': function(e) {
				var $this = $(e.currentTarget);
				if (_.getLocalStorage('CHATSOUND') === 'off') {
					$this.text('Sound On');
					_.setLocalStorage('CHATSOUND','on');
				} else {
					$this.text('Sound Off');
					_.setLocalStorage('CHATSOUND','off');
				}
			}
		}
	});
});