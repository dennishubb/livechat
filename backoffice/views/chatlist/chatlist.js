const { forEach } = require("underscore");

$(function() {
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/chatlist/chatlist.css">');

	var request = {'merchant_id':5};
	$.post('http://api.livechat.com/v1/chats/get', request, function(data){
		console.log('chats/get');
		console.log(data);
		// data = _.filter(data, function(c){ return c.user && c.user.id; });
		if (!(data.data && data.data.length)) {
			return;
		}
		var chats = data.data;
		var today = moment().format('D MMM YYYY');
		var h = '';
		_.each(sortList(chats), function(m) {
			if (self.pintype !== 'ALL' && self.pintype !== parseInt(m.pinned)) {
				return;
			}
			var displayTime = moment(m.createdDateTime);
			if (displayTime.format('D MMM YYYY') === today) {
				displayTime = displayTime.format('h:mm A');
			} else {
				displayTime = displayTime.format('D MMM');
			}
			h+= '<a class="chat '+chatStatus(m)+'" data-mam-id="'+m.merchant_id+'" data-id="'+m.user_id+'" href="chat/'+TOKEN+'/messages/'+m.id+'">'+
					'<p class="time">'+displayTime+'</p>'+
					'<p class="name">'+m.user_name+'</p>'+
					'<p class="text">'+m.message.replace(/(?:\r\n|\r|\n|(<([^>]+)>))/g, ' ')+'</p>'+
					'<i class="fa fa-exclamation-circle exclamation"></i>'+
					'<span class="pin" data-setpin="'+(m.pinned ? 0 : 1)+'">PIN</span>'+
				'</a>';
		});
		self.$el.find('.wrapper').html(h);
	});

	function sortList(chats) {
		// self = this;
		// var cs = _.config('ChatSort');
		// if (cs) {
		// 	chats = _.sortBy(chats, function(m) {
		// 		var s = self.chatStatus(m);
		// 		var a = {'red':2,'orange':3,'':4};
		// 		var b = 'Z';
		// 		if (cs === 1 && m.user && m.user.class) {
		// 			b = m.user.class[0];
		// 			if (b === 'N') {
		// 				b = m.user.class[1];
		// 			}
		// 		}
		// 		return a[s]+b;
		// 	});
		// }
		chats = _.sortBy(chats, function(m) {
			if (self.chatStatus(m) === 'pinned') {
				return 'pinned';
			} else if (self.chatStatus(m) === 'yellow') {
				return 'yellow';
			}
		});
		return chats;
	};
	
	function chatStatus(m) {
		if (parseInt(m.pinned)) {
			if (m.last_message_user_id !== m.user_id) {
				return 'pinned';
			}
			return 'yellow';
		}
		if (m.last_message_user_id !== m.user_id) {
			return '';
		}
		// var msgtype = '';
		// if (m.message && m.message.length) {
		// 	if (_.isReferrerCode(m.message)) {
		// 		msgtype = 'RF';
		// 	} else if (m.message === 'Join') {
		// 		msgtype = 'JOIN';
		// 	}
		// }
		// var color = _.deepGet(_.config('ChatColor'),msgtype);
		// if (color === 0) {
		// 	return '';
		// }
		// if (color !== 1 && (['WhatsAppOnlyNoReply','WhatsAppOnlyNoReplySMS'].includes(_.conf('SignUpMethod')) || _.config('ChatSort') === 1) && ['RF','JOIN'].includes(msgtype)) {
		// 	return '';
		// }

		// TBD: store merchant prefered color?
		// var sec = parseInt(moment().diff(m.created_at,'seconds'));
		// if ([48].indexOf(_.getVar('merchantId')) >= 0 && sec >= 5) {
		// 	return 'red';
		// } else if ([62,170].indexOf(_.getVar('merchantId')) >= 0 && sec >= 10) {
		// 	return 'red';
		// } else if ([6].indexOf(_.getVar('merchantId')) >= 0 && sec >= 60) {
		// 	return 'red';
		// } else if ([195].indexOf(_.getVar('merchantId')) >= 0 && sec >= 120) {
		// 	return 'red';
		// } else if (sec >= 180) {
		// 	return 'red';
		// }
		return 'orange';
	};

	// toggleButtonState: function() {
	// 	var playSound = _.getLocalStorage('CHATSOUND');
	// 	var btn = $('.chat-sound');
	// 	playSound === 'off' ? btn.text('Sound Off') : btn.text('Sound On');
	// },

	// events: {
	// 	'click .pin-type': function(e) {
	// 		var self = this;
	// 		var $this = $(e.currentTarget);
	// 		$this.addClass('selected').siblings().removeClass('selected');
	// 		self.pintype = $this.data('type');
	// 		_.setLocalStorage('PINTYPE',self.pintype);
	// 		self.renderList();
	// 	},
	// 	'click .pin': function(e) {
	// 		var self = this;
	// 		e.stopPropagation();
	// 		e.preventDefault();
	// 		var $this = $(e.currentTarget);
	// 		var mamId = parseInt($this.closest('a.chat').data('mam-id')) || '';
	// 		var userId = parseInt($this.closest('a.chat').data('id'));
	// 		var setPin = $this.data('setpin');
	// 		if (mamId && userId) {
	// 			$.post('/chat/pin', {mamId:mamId,userId:userId,setPin:setPin}, function () {
	// 				self.maCreatedDateTime[mamId] = '';
	// 				self.getChats();
	// 			});
	// 		}
	// 	},
	// 	'click .chat-sound': function(e) {
	// 		var $this = $(e.currentTarget);
	// 		if (_.getLocalStorage('CHATSOUND') === 'off') {
	// 			$this.text('Sound On');
	// 			_.setLocalStorage('CHATSOUND','on');
	// 		} else {
	// 			$this.text('Sound Off');
	// 			_.setLocalStorage('CHATSOUND','off');
	// 		}
	// 	}
	// }
});