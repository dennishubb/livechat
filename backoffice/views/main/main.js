define(function(require) {

	console.log("main");
	
	var Backbone		= require('backbone'),
		Access			= require('js/Access'),
		EditorView		= require('views/main/editor/editor'),
		// TwofaView		= require('views/main/twofa/twofa'),
		tpl				= require('text!views/main/main.html'),
		cssA			= require('text!views/main/cssA.html');
	
	var MainView = Backbone.View.extend({
		
		el: 'body',
		
		initialize: function(options) {

			console.log("main init");
			

			const _ = require('underscore');
			console.log(_);
			
			this.template = _.template(tpl);
			this.contentView = null;
			this.audio = {};
			this.periodics = {};
			this.disablePopupWindowClose = false;
			var self = this;

		},
		
		render: function() {
			
			var self = this;
			self.$el.html(self.template({}));
			self.applyCSS();
			self.$header = self.$el.find('#header');
			self.$content = self.$el.find('#content');
			self.$popupwindow = self.$el.find('#popupwindow');
			self.$loading = self.$el.find('#loading');

			// if (User.get('id') && User.get('token')) {
			// 	var completed = _.after(2, function() {
			// 		self.hardcodeAccess();
			// 		if (window.location.href.split('#').length === 1) {
			// 			var $href = self.$header.find('a[href]');
			// 			if ($href.length === 0) {
			// 				$href = self.$sidemenu.find('a[href]');
			// 			}
			// 			var href = $href.eq(0).attr('href');
			// 			if (href) {
			// 				window.location.href = href;
			// 			} else {
			// 				return;
			// 			}
			// 		}
			// 		Backbone.history.start();
			// 		self.showTimeZone();
			// 		self.showAdminNotice();
			// 		self.showAlertNotice();
			// 		self.checkPending();
			// 	});
			// 	$.post('/merchants/get', {includeSiteName:1}, function(data) {
			// 		_.setVar('merchant',data);
			// 		_.setVar('config',JSON.parse(data.config));
			// 		_.setVar('currency',data.currency);
			// 		_.setVar('siteName',data.siteName);
			// 		_.setVar('siteProduct',data.siteProduct);
			// 		_.getSiteGames(data.sites);
			// 		var color = _.conf('AdminThemeColor');
			// 		if (color) {
			// 			self.$header.css({'background-color':color});
			// 		}
			// 		completed();
			// 	});
			// 	self.getAdminUser(completed);
			// } else {
			// 	window.location.href = '#login';
				Backbone.history.start();
			// }
			
			// self.initMutationObserver();

			// self.sendUntranslatedText();
			
			// self.$el.append('<iframe src="'+_.getVar('trackingURL')+'"></iframe>');
			
			// self.$el.find('.change-language').val(_.getLocalStorage('LANGUAGE') || 'EN');

			return this;
		},
		
		showCaptcha: function(p1) {
			var self = this;
			var count = 0;
			if (typeof p1 === 'boolean') {
				if (self.captcha && self.captcha.callback) {
					self.captcha.callback({captchaResult:p1});
					self.captcha.callback = null;
				}
			} else if (typeof self.captcha === 'undefined') {
				self.$el.append('<a id="captcha-button"></a>');
				self.showLoad(true);
				initAliyunCaptcha({
					SceneId: 'dz5ch7sdh',
					prefix: '16dibs8',
					mode: 'popup',
					region: 'sgp',
					language: 'en',
					button: '#captcha-button',
					getInstance: function(instance) {
						self.captcha = instance;
						self.captcha.proceed = p1;
						count++;
						if (count === 1) {
							setTimeout(function() {
								self.showLoad(false);
								self.$el.find('#captcha-button').trigger('click');
							},0);
						}
					},
					captchaVerifyCallback: function(captchaOutput,callback) {
						self.captcha.callback = callback;
						self.captcha.proceed(captchaOutput);
					}
				});
			} else {
				self.captcha.proceed = p1; // must update self.captcha.proceed to new function again
				self.$el.find('#captcha-button').trigger('click');
			}
		},
		
		hardcodeAccess: function() {
			var self = this;
			var role = User.get('role');
			var countHeader = 0;
			var countReport = 0;
			var accessRole = _.getVar('userAccess') || _.conf('Access'+role);
			if (_.config('CounterLiveChat')) {
				_.each(Access, function(v,k) {
					if (v.href === '#chatlist') {
						Access[k].role.push('KOUNTER');
					}
				});
			}
			if (role === 'KOUNTER') {
				_.moveArrayElement(Access,'href','#chatlist','#counter');
				_.moveArrayElement(Access,'href','#users','#admins',true);
			}
			_.each(Access, function(a) {
				if (a.hideFromMenu) {
					return;
				}
				if (a.specificMerchant && a.specificMerchant.indexOf(_.getVar('merchantId')) < 0) {
					return;
				}
				var limitPage = _.config('BELimitPage');
				if (limitPage && (typeof a.href !== 'string' || limitPage.indexOf(a.href.substring(1)) < 0)) {
					return;
				}
				if (User.get('role').indexOf('KOUNTER') >= 0) {
					if (_.getVar('merchantId') === 575) {
						if (['#reports/counterTransaction','#reports/counterWinLose'].indexOf(a.href) >= 0) {
							return;
						}
					} else {
						if (['#soccer','#game'].indexOf(a.href) >= 0) {
							return;
						}
					}
				}
				if (a.href && (accessRole ? accessRole.includes(a.href) : a.role.includes(role))) {
					if (a.href.indexOf('#reports/') >= 0) {
						if (countReport) {
							return;
						} else {
							countReport++;
						}
					}
					if (countHeader < 5 && User.get('role').indexOf('KOUNTER') < 0) {
						self.$header.append('<a href="'+a.href+'" class="'+a.icon+'"></a>');
					} else if (a.href) {
						var name = a.showHTML;
						if (a.href.indexOf('#reports/') >= 0) {
							name = 'REPORT';
						}
						self.$el.find('.side-menu-item').append('<a href="'+a.href+'"><i class="'+a.icon+'"></i>'+name+'</a>');
					}
					countHeader++;
				}
			});
			if (_.conf('AgentCommissionType') === 'ManualCommission' && _.conf('AgentCommissionTypeAgent') === 'ManualCommission') {
				self.$el.find('[href="#referrer"]').remove();
			} 
			if (_.conf('AgentCommissionType') !== 'ManualCommission' && _.conf('AgentCommissionTypeAgent') !== 'ManualCommission') {
				self.$el.find('[href="#commission"]').remove();
			}
			if (parseInt(_.deepGet(User.get('setting'),'apiEnabled')) !== 1) {
				self.$el.find('[href="#api"]').remove();
			}
			if (self.$el.find('[href="#userMgmt"]').length) {
				self.$el.find('[href="#users"]').remove();
				self.$el.find('[href="#admins"]').remove();
			}
			if (parseInt(_.config('excel')) === 0) {
				self.$header.find('[href="#bankTx"]').remove();
			}
			var $headermenu = self.$header.children('a');
			if ($headermenu.length > 1) {
				$headermenu.css({'width':(Math.floor(10000/($headermenu.length))/100)+'%'});
				self.$header.find('.user').hide();
			}
		},
		
		showAdminNotice: function() {
			var self = this;
			var adminNotice = _.deepGet(_.getVar('merchant'),'adminNotice','remark');
			if (_.checkAccess(User.get('role'),'HideAdminNotice') || !adminNotice) {
				self.$el.addClass('hide-admin-notice');
			} else if (adminNotice) {
				self.$adminNotice.append(adminNotice);
			}
		},

		showTimeZone: function() {
			var self = this;
			var deviceOffset = moment(new Date).format('Z');
			var systemOffset = _.getVar('merchant').tzOffset;
			self.$el.find('.devicetz').append('<span>System:</span> '+ systemOffset+' <span>Device:</span> '+ deviceOffset);
		},
		
		getAdminUser: function(cb) {
			var self = this;
			$.post('/users/getAllUsers', {id:User.get('id'),needSetup2FA:1}, function(data) {
				if (data.length) {
					var user = data[0];
					_.each(['username','referrerId','cashSiteDatetime','referLink','needSetup2FA'], function(k) {
						if (user[k]) {
							User.set(k,user[k]);
						}
					});
					if (user.setting) {
						User.set('setting',JSON.parse(user.setting));
						if (_.deepGet(User.get('setting'),'Access')) {
							_.setVar('userAccess',_.deepGet(User.get('setting'),'Access'));
						}
					}
					if (user.cash) {
						self.$header.find('.score span').text(user.cash);
					}
				}
				cb && cb();
			});
		},
		
		changeRoute: function(view,params) {
			var self = this;
			if (self.contentView !== view) {
				if (self.contentView) {
					self.contentView.undelegateEvents();
					self.contentView.$el.removeData().unbind();
					self.contentView.remove();
					self.$content.empty();
					_.each(self.contentView.pikadays, function(pikaday) {
						pikaday.destroy();
					});
					self.popUpWindow('close');
				}
				self.contentView = view;
				if (params && params.fullscreen) {
					self.$el.addClass('fullscreen');
				} else {
					self.$el.removeClass('fullscreen');
				}
				self.$content.html(self.contentView.$el);
				var currentPage = window.location.href.split('#').pop();
				self.$header.find('.selected').removeClass('selected');
				self.$header.find('[href="#'+currentPage+'"]').addClass('selected');
				self.$sidemenu.find('.selected').removeClass('selected');
				self.$sidemenu.find('[href="#'+currentPage+'"]').addClass('selected');
				if (self.$el.css('visibility') === 'hidden') {
					self.$el.css('visibility','visible');
				}
			}
			return this;
		},
		
		initMutationObserver: function() {
			var self = this;
			var $popupwrapper = self.$popupwindow.find('.wrapper');
			var observer = new MutationObserver(function(list) {
				console.log('popupwrapper');
				$popupwrapper.css('margin',Math.max(10,Math.floor((self.$popupwindow.height() - $popupwrapper.outerHeight())/2))+'px auto');
			});
			observer.observe($popupwrapper[0], {childList:true,subtree:true});
		},

		showLoad: function(bool) {
			var self = this;
			if (bool) {
				if (self.showLoad.count) {
					self.showLoad.count++;
				} else {
					self.showLoad.count = 1;
				}
			} else {
				self.showLoad.count--;
			}
			if (self.showLoad.count) {
				$('#loading').show();
			} else {
				$('#loading').hide();
			}
		},
		
		popUpWindow: function(view,title,options) {
			var self = this;
			self.disablePopupWindowClose = false;
			if(_.deepGet(options,'disablePopupWindowClose')) {
				self.disablePopupWindowClose = options.disablePopupWindowClose;
			}
			if (view === 'close') {
				self.$popupwindow.css('opacity',0);
				setTimeout(function() {
					self.$popupwindow.hide();
				},300);
				return;
			}
			if (view === 'title') {
				self.$popupwindow.find('.head').html(title); 
				return;
			}
			self.$popupwindow.find('.head').html(title);
			self.$popupwindow.find('.body').html(view.$el);
			self.$popupwindow.show();
			setTimeout(function() {
				self.$popupwindow.css('opacity',1);
			},0);
		},
		
		playAudio: function(track) {
			var self = this;
			if (_.getLocalStorage('CHATSOUND') === 'off') {
				return;
			}
			if (!self.audio[track]) {
				self.audio[track] = new Audio(track);
				self.audio[track].volume = 1;
			}
			self.audio[track].pause();
			self.audio[track].currentTime = 0;
			self.audio[track].play();
		},
		
		periodic: function(view,fn,duration) {
			var self = this;
			console.log(self.periodics);
			clearTimeout(self.periodics[view.cid]);
			self.periodics[view.cid] = setTimeout(function() {
				if (document.body.contains(view.el)) {
					fn.apply(view,['periodic']);
				} else {
					delete self.periodics[view.cid];
				}
			},duration);
		},
		
		checkPending: function() {
			var self = this;
			clearTimeout(self.checkPendingTimeoutID);
			console.log('/status/getPending');
			$.post('/status/getPending', {background:1}, function(data) {
				if (parseInt(data.transaction)) {
					self.trigger('newtransaction');
					self.playAudio('https://static.gwvkyk.com/other/bell-2.mp3');
				} else if (parseInt(data.chat)) {
					self.trigger('newmessage');
					self.playAudio('https://static.gwvkyk.com/other/chat.mp3');
				}
			}).always(function() {
				self.checkPendingTimeoutID = setTimeout(function() {
					self.checkPending();
				},10000);
			});
		},
		
		sendUntranslatedText: function() {
			var self = this;
			if ([5,6,60,760,75,9,193,29,10008,216,10307,10162,461,105,10172,10527,180,10263,187,10292].indexOf(parseInt(_.getVar('merchantId'))) >= 0) {
				clearTimeout(self.sendUntranslatedTextTimeoutID);
				self.sendUntranslatedTextTimeoutID = setTimeout(function() {
					var untx = [];
					_.each(window.UNTX, function(v,k) {
						if (v === 1) {
							untx.push(k);
							window.UNTX[k] = 0;
						}
					});
					console.log('/tool/untranslatedText', untx);
					if (untx.length) {
						$.post('/tool/untranslatedText', {untx:JSON.stringify(untx),background:1}, function() {
							
						}).always(function() {
							self.sendUntranslatedText();
						});
					} else {
						self.sendUntranslatedText();
					}
				},5*60*1000);
			}
		},
		
		applyCSS: function() {
			// if (_.config('AdminPageCSS') && (!User.get('role') || User.get('role') == 'KOUNTER')) {
				var style = document.createElement('style');
				style.id = 'cssA';
				style.type = 'text/css';
				style.innerHTML = cssA;
				document.getElementsByTagName("head")[0].appendChild(style);
			// }
		},

		editor: function(data){
			new EditorView(data).render();
		},

		showAlertNotice: function() {
			var self = this;
			var toDate = moment().format('YYYY-MM-DD');
			var noDate = _.getLocalStorage('showAlertNotice') || toDate;
			if (noDate && noDate <= toDate) {
				_.setLocalStorage('showAlertNotice', moment().add(1,'day').format('YYYY-MM-DD'));
				var text = '';
				var completed = function() {
					if (text) {
						_.alert({type:'',title:'',html:'<div id="alertnotice">'+text+'</div>',width:'60%',showConfirmButton:true,showCancelButton:false}, function() {
							self.setup2FA(true);
						});
					} else {
						self.setup2FA(true);
					}
				};
				if (_.conf('SignUpMethod').includes('SMS')) {
					var msg  = '';
					var smsCredit = parseFloat(_.deepGet(_.getVar('merchant'),'smsCredit'));
					if (smsCredit >= 0 && smsCredit <= 1) {
						msg = 'Your SMS credit ('+_.money(smsCredit)+') is insufficient';
					} else if (smsCredit >= 0 && smsCredit < 10) {
						msg = 'Your SMS credit ('+_.money(smsCredit)+') is running low';
					}
					if (msg) {
						text+= '<h3>SMS Credit</h3><p>'+msg+'</p><a class="swal-close" href="#payment">Click here to top up</a>';
					}
				}
				$.post('/merchants/getMerchantCF', function(data) {
					var msg = '';
					var tDate = moment().format('YYYY-MM-DD');
					var mDate = moment().add(1,'month').format('YYYY-MM-DD');
					_.each(data, function(item) {
						if (item.status !== 'OK') {
							msg+= '<p>('+item.domainName+') has failed.</p>';
						} else if (item.expiry != 'UNKNOWN') {
							if (item.expiry < tDate) {
								msg+= '<p>('+item.domainName+') has expired on '+item.expiry+'.</p>';
							} else if (item.expiry < mDate) {
								msg+= '<p>('+item.domainName+') will be expired on '+item.expiry+'.</p>';
							}
						} else if (item.type === 'PRIMARY') {
							msg+= '<p>('+item.domainName+') is not secured.</p>';
						}
					});
					if (msg) {
						text+= '<h3>Domain Expiry</h3>'+msg+'<a class="swal-close" href="#domain">Click here to fix</a>';
					}
					completed();
				});
			}
		},

		setup2FA: function(init) {
			// if (init && User.get('needSetup2FA') !== 1) {
			// 	return;
			// }
			// new TwofaView({}).render();
		},

		events: {
			'click .swal-close': function(e) {
				_.closeAlert();
			},
			'click #header .toggle-menu': function(e) {
				if ($(e.currentTarget).hasClass('toggle-menu')) {
					this.$el.toggleClass('show-menu');
				} else {
					this.$el.removeClass('show-menu');
				}
			},
			'click #header .score-log': function(e) {
				var self = this;
				if (self.creditLogViewOpened) {
					self.creditLogViewOpened = false;
					self.popUpWindow('close');
				} else {
					self.creditLogViewOpened = true;
					new CreditLogView({}).render();
				}
			},
			'click #side-menu a': function(e) {
				var $this = $(e.currentTarget);
				$this.addClass('selected').siblings('.selected').removeClass('selected');
				this.$el.removeClass('show-menu');
			},
			'click #side-menu a.logout': function(e) {
				User.clear({silent:true}).saveLocal();
				location.reload();
			},
			'change #side-menu .change-language': function(e) {
				var lang = $(e.currentTarget).val();
				if (lang) {
					_.setLocalStorage('LANGUAGE', lang);
					location.reload();
				}
			},
			'click #content': function(e) {
				this.$el.removeClass('show-menu');
			},
			'click #popupwindow': function(e) {
				var self = this;
				if (self.disablePopupWindowClose) return;
				if ($(e.target).closest('.wrapper').length === 0) {
					self.popUpWindow('close');
				}
			}
		}
	});
	
	window.MainView = new MainView();

	return window.MainView;
	
});