require.config({
	baseUrl: '.',
	paths: {
		jquery: 'lib/jquery-1.11.2.min',
		underscore: 'lib/underscore-1.7.0.min',
		backbone: 'lib/backbone-1.1.2.min',
		text: 'lib/text-2.0.12',
		views: 'js/views',
		models: 'js/models'
	},
	deps: [
		'js/common',
		'lib/moment.min',
		'lib/SMSCounter',
		'plugins/simplePagination/simplePagination'
	],
	shim: {
		'backbone': ['js/common','jquery'],
		'js/common': ['underscore'],
		'plugins/simplePagination/simplePagination': ['jquery'],
		'text':['jquery'],
		'lib/SMSCounter':['jquery']
	},
	urlArgs: 'v='+VERSION,
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port) {
				return true;
			},
			onXhrComplete: function (xhr,url) { // for development only, will not run after build
				var tmp = url.replace('.html','.css');
				$.get(tmp,function(css) {
					var style = document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = css;
					document.getElementsByTagName("head")[0].appendChild(style);
				});
			}
		}
	}
});

require(['backbone', 'js/router', 'views/main/main', 'models/User'], function(Backbone, Router, MainView, User) {
	
	Backbone.emulateJSON = true;
	
	var sync = Backbone.sync;
	Backbone.sync = function (method, model, options) {
		if (typeof options.data.append === 'function') {
			options.data.append('merchantId', _.getVar('merchantId'));
			options.data.append('accessId', User.get('id') || '');
			options.data.append('accessToken', User.get('token') || '');
		} else {
			options.data = _.extend((options.data||{}), {
				merchantId: _.getVar('merchantId'),
				accessId: User.get('id') || '',
				accessToken: User.get('token') || ''
			});
		}
		options.type = 'POST';
		sync(method, model, options);
	};
	
	Backbone.View.prototype.goTo = function (fragment,options) {
		Router.navigate(fragment,options);
	};
	
	$.ajaxPrefilter(function(options,originalOptions,jqXHR) {
		if (options.url.charAt(0) === '/') {
			var params = {module:options.url,merchantId:_.getVar('merchantId'),accessId:(User.get('id') || ''),accessToken:(User.get('token') || '')};
			if (options.data && typeof options.data.append === 'function') {
				_.each(params, function(v,k) {
					options.data.append(k,v);
				});
			} else {
				var tmp = _.reduce(params, function(m,v,k) { return m+'&'+k+'='+encodeURIComponent(v); }, '');
				if (_.isEmpty(options.data)) {
					options.data = tmp.substring(1);
				} else {
					options.data+= tmp;
				}
			}
			options.url = _.getVar('apiURL');
			options.xhr = function() {
				var xhr = jQuery.ajaxSettings.xhr();
				var setRequestHeader = xhr.setRequestHeader;
				xhr.setRequestHeader = function(name, value) {
					if (name == 'X-Requested-With') return;
					setRequestHeader.call(this, name, value);
				}
				return xhr;
			};
		}
		if (options.url === _.getVar('apiURL')) {
			var success = options.success;
			if (options.data && typeof options.data.indexOf === 'function' && options.data.indexOf('background=1') < 0) {
				MainView.showLoad(true);
			}
			options.success = function(data,textStatus,jqXHR) {
				if (data.status === 'SUCCESS') {
					MainView.showCaptcha(true);
					success && success(data.data,textStatus,jqXHR);
				} else if (data.status === 'ERROR' && data.data && data.data.message) {
					if (data.data.message === 'Invalid Access!') {
						User.clear({silent:true}).saveLocal();
						window.location = document.URL.split('#')[0];
					} else if (data.data.message === 'Invalid Captcha!') {
						MainView.showCaptcha(false);
					} else {
						MainView.showCaptcha(true);
						_.alert(data.data.message);
					}
				}
				if (options.data && typeof options.data.indexOf === 'function' && options.data.indexOf('background=1') < 0) {
					MainView.showLoad(false);
				}
			};
		}
	});
	
	if (document.URL.indexOf('?') >= 0) {
		var url = new URL(window.location.href);
		var userParams = {};
		var directAccess = true;
		_.each(['id','name','type','role','token'], function(k) {
			var v = url.searchParams.get(k);
			if (v) {
				userParams[k] = v;
			} else {
				directAccess = false;
			}
		});
		if (directAccess) {
			User.set(userParams).saveLocal();
			window.location = document.URL.split('?')[0];
		}
	}
	
	if (typeof cordova !== 'undefined') {
		document.addEventListener('deviceready',function() {
			MainView.render();
		},false);
	} else {
		MainView.render();
	}
});