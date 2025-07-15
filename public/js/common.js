define(['lib/sweetalert2.all.min','lib/Autolinker.min','models/Access'], function(swal,Autolinker,Access) {

	window.getApiHost = function (mId) {
		var apiHost = window.location.host;
		mId = parseInt(mId) || 0;
		if (mId === 0 && window.location.host.indexOf('localhost') >= 0) {
			mId = MERCHANTID;
		}
		if (mId !== 0) {
			apiHost = 'a1.u55y38.com';
			if (mId > 1000 && mId < 10000) {
				apiHost = 'a2.n9686b.com';
			}
		}
		return apiHost;
	}

	var endPointURL = 'wallet-merchant-env-2.eba-abam5mc5.ap-southeast-1.elasticbeanstalk.com';
	if (MERCHANTID > 1000 && MERCHANTID < 10000) {
		endPointURL = 'gbox-env-2.ap-southeast-1.elasticbeanstalk.com';
	}

	var commonData = {
		apiURL: 'https://'+getApiHost(0)+'/api/v1/index.php',
		endPointURL: endPointURL,
		ipapiURL: 'https://pro.ip-api.com/json/?key=aXn7IV0jBWzTsfN',
		trackingURL: 'https://'+getApiHost(0)+'/mobile/component/tracking.html',
		merchantId: MERCHANTID,
		config: CONFIG,
		currency: null,
		siteName: null
	};
	
	var jparse = JSON.parse;
	JSON.parse = function(string) {
		var data = null;
		if (string) {
			try {
				data = jparse(string);
			}
			catch (err) {}
		}
		return data;
	};

	_.mixin({
		getVar: function(key) {
			return commonData[key];
		},
		setVar: function(key,value) {
			commonData[key] = value;
		},
		getLocalStorage: function(key) {
			return localStorage[key] ? JSON.parse(localStorage[key]) : null;
		},
		setLocalStorage: function(key,data) {
			localStorage[key] = JSON.stringify(data);
		},
		deepGet: function() {
			var v = arguments[0];
			var i = 1;
			if (typeof v === 'string') {
				v = JSON.parse(v);
			}
			while (v && i < arguments.length) {
				v = v[arguments[i]];
				i++;
			}
			return v;
		},
		alert: function(p1,p2,p3) {
			var options = {type:'error'};
			var cb = null;
			if (_.isString(p1)) {
				options.html = p1;
			}
			if (_.isObject(p1)) {
				options = _.extend(options,p1);
			}
			if (_.isObject(p2)) {
				options = _.extend(options,p2);
			}
			if (_.isFunction(p2)) {
				cb = p2;
			}
			if (_.isFunction(p3)) {
				cb = p3;
			}
			if (!options.title && options.type === 'error') {
				options.title = 'Oops!';
			}
			try {
				$('#touchmask').show();
				eval("swal(options).then((result) => {if (result.value) {cb && cb(result.value);}});");
				setTimeout(function() {
					$('#touchmask').hide();
				},500);
			} catch(err) {
				alert(options.html);
				cb && cb();
			}
		},
		closeAlert: function() {
			eval('swal.close()');
		},
		confirm: function(p1,success,failed) {
			var options = {title:'Please Confirm',type:'question',showCancelButton:true,confirmButtonText:'Yes',confirmButtonColor:'#4CAF50',cancelButtonText:'No',cancelButtonColor:'#F44336'};
			if (_.isString(p1)) {
				options.html = p1;
			}
			if (_.isObject(p1)) {
				options = _.extend(options,p1);
			}
			try {
				$('#touchmask').show();
				eval("swal(options).then((result) => {if (result.value) {success && success(result.value);} else {failed && failed();}});");
				setTimeout(function() {
					$('#touchmask').hide();
				},500);
			} catch(err) {
				if (confirm(options.html)) {
					success && success();
				} else {
					failed && failed();
				}
			}
		},
		money: function(amount,currency) {
			var decimal = 2;
			if (['IDR','MMK','VND'].indexOf(commonData.currency) >= 0) {
				decimal = 0;
			}
			if (currency === true) {
				currency = commonData.currency;
			}
			return (currency || '')+parseFloat(amount || 0).toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
		},
		Autolinker: function(text) {
			return Autolinker.link(text,{stripPrefix:false});
		},
		tzName: function() {
			return new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
		},
		printIf: function() {
			var string = arguments[0];
			for (i = 1; i < arguments.length; i++) {
				if (arguments[i]) {
					string = string.replace('%'+i,arguments[i]);
				} else {
					return '';
				}
			}
			return string;
		},
		fdatetime: function(datetime) {
			return datetime ? moment(datetime).format('D MMM YYYY h:mmA') : '';
		},
		fdatetimedays: function(datetime) { 
			if(!datetime) {
				return '';
			}
			
			var endDate = moment(datetime); 
			var currentDate = moment(); 
			var totalDaysDifference = currentDate.diff(endDate, 'days');
			
			return moment(datetime).format('D MMM YYYY h:mmA') + ' (' + totalDaysDifference + ' days ago)';
		},
		fdate: function(datetime) {
			return datetime ? moment(datetime).format('D MMM YYYY') : '';
		},
		ftime: function(datetime) {
			return datetime ? moment(datetime).format('h:mmA') : '';
		},
		conf: function(key) {
			return _.deepGet(_.getVar('config'),key);
		},
		config: function(key) {
			return _.deepGet(JSON.parse(_.deepGet(_.getVar('config'),'Config')),key);
		},
		getSiteGames: function(sites) {
			var games = [];
			var siteName = _.getVar('siteName');
			_.each(sites, function(details,site) {
				var game = null;
				if (site.indexOf('SMART') === 0 || site.indexOf('AVGX') === 0 || site.indexOf('ATLAS') === 0) {
					var tmp = JSON.parse(details.key_3);
					if (tmp && tmp.product) {
						game = tmp.product;
						if (tmp.currency) {
							game += '-'+tmp.currency;
						}
						siteName[site] = game;
					}
				}
				if (details && details.product) {
					var ps = JSON.parse(details.product);
					if (ps) {
						_.each(ps, function(type,pId) {
							if (game) {
								siteName[site+'-'+pId] = game+' '+type;
							}
							games.push(site+'-'+pId);
						});
						if (site.substring(0,5) === 'JOKER' || site.substring(0,2) === 'VP' || ['SPADE','SPADE2','MG','MG2','JILI','JILI2','JILI3','MACROSS','MACROSS2','MACROSS3','NS','DGS','KA','PLAYSTAR','PLAYSTAR2','SP','ACEWIN','PEGS','PEGS2','EVOGAMES','FUNKY','GMSJD','YGR','YGR2','BT','BT2','FC','MARIO','WE','IBC','GMSGE','EBET','A1','A12','PXPLAY','PXPLAY2'].indexOf(site) >= 0) {
							games.push(site);
						}
					} else {
						games.push(site);
					}
				} else {
					games.push(site);
					if (['PT','GP','MDBOMP','MDBOG8','AGGB'].indexOf(site) >= 0) {
						games.push(site+'-LIVE');
					}
				}
			});
			games.sort(function(x,y) { return ['LV22','GMSL4','MDBOL4'].indexOf(x) >= 0 ? -1 : ['LV22','GMSL4','MDBOL4'].indexOf(y) >= 0 ? 1 : 0; });
			games.sort(function(x,y) { return ['VP','VP2','VP3'].indexOf(x) >= 0 ? -1 : ['VP','VP2','VP3'].indexOf(y) >= 0 ? 1 : 0; });
			games.unshift('CORRECTSCORE');
			games = _.map(games, function(g) { return {'game':g, 'name': siteName[g] || ''}; });
			return games;
		},
		pad: function(n,l) {
			return ('000000000'+n).slice(-l);
		},
		copy: function(input) {
			if (_.isIOS()) {
				var editable = input.contentEditable;
				var readOnly = input.readOnly;
				input.contentEditable = true;
				input.readOnly = false;
				var range = document.createRange();
				range.selectNodeContents(input);
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				input.setSelectionRange(0,999999);
				input.contentEditable = editable;
				input.readOnly = readOnly;
			} else {
			 	input.select();
			}
			document.execCommand('copy');
		},
		isIOS: function() {
			if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
				if (!!window.indexedDB) { return 'iOS 8 and up'; }
				if (!!window.SpeechSynthesisUtterance) { return 'iOS 7'; }
				if (!!window.webkitAudioContext) { return 'iOS 6'; }
				if (!!window.matchMedia) { return 'iOS 5'; }
				if (!!window.history && 'pushState' in window.history) { return 'iOS 4'; }
				return 'iOS 3 or earlier';
			}
			return false;
		},
		checkAccess: function(role,access) {
			var ga = _.find(Access, function(a) { return a.href === access || a.key === access; });
			var accessRole = _.getVar('userAccess') || _.conf('Access'+role);
			if (ga.specificMerchant && ga.specificMerchant.indexOf(_.getVar('merchantId')) < 0) {
				return false;
			}
			if (accessRole) {
				if (accessRole.includes(access)) {
					return true;
				}
			} else {
				if (ga && ga.role.includes(role)) {
					return true;
				}
			}
			return false;
		},
		hasSoccer: function() {
			if (_.deepGet(JSON.parse(_.getVar('merchant').game),'CSOddMultiplier')) {
				return true;
			}
			return false;
		},
		isReferrerCode: function(text) {
			if (text && text.length && text.length > 5 && text.length < 20) {
				if (text.indexOf('RF') === 0 || (_.conf('ReferrerPrefix') && text.indexOf(_.conf('ReferrerPrefix')) === 0)) {
					return true;
				}
			}
			return false;
		},
		pinChatRename: function(pin) {
			var rename = _.config('PinChatRename');
			if (rename && rename[pin]) {
				return rename[pin];
			}
			return pin;
		},
		isITSupport: function() {
			if (User.get('username').indexOf('IT-SUPPORT-') === 0) {
				return true;
			}
			return false;
		},
		escapeHTML: function(str) {
			return str.replace(/&/g, "&amp;")
					  .replace(/</g, "&lt;")
					  .replace(/>/g, "&gt;")
					  .replace(/"/g, "&quot;")
					  .replace(/'/g, "&#039;");
		},
		moveArrayElement: function(arr,attr,v1,v2,before) {
			var item = null;
			var itemPos = 0;
			var newPos = 0;
			_.each(arr, function(v,k) {
				if (v[attr] === v1) {
					item = v;
					itemPos = k;
				}
			});
			arr.splice(itemPos,1);
			_.each(arr, function(v,k) {
				if (v[attr] === v2) {
					newPos = k;
				}
			});
			arr.splice(newPos + (before ? 0 : 1), 0, item);
		}
	});

	window.UNTX = {};
	var lang = _.getLocalStorage('LANGUAGE') || 'EN';
	var tx = function(string) {
		var test1 = new RegExp(/^[a-z .\/:]+$/);
		var test2 = new RegExp(/^[a-z]/);
		// for text in html tag
		var sentences = [];
		var safe = string.replace(/<option>.*<\/option>/, '');
		_.each(safe.split('>'), function(c) {
			var s = c.split('<')[0];
			var clean = s.replace(/[^A-Z]+/gi,'').trim();
			if (clean) {
				sentences.push(s);
			}
		});
		_.each(sentences, function(s) {
			var x = s.trim().toLowerCase();
			if (TRANSLATE[x]) {
				if (TRANSLATE[x][lang]) {
					var translated = TRANSLATE[x][lang];
					var prefix = s[0] === ' ' ? ' ' : '';
					var suffix = s.slice(-1) === ' ' ? ' ' : '';
					// prevent translate attribute value
					string = string.replaceAll('"'+s+'"', '"[@1]"');
					if (s === s.toUpperCase()) {
						translated = translated.toUpperCase();
					}
					if (string === s) {
						string = translated;
					} else if (string.indexOf('>'+s+'<') >= 0) {
						string = string.replace('>'+s+'<', '>'+prefix+translated+suffix+'<');
					} else {
						string = string.replace(s, prefix+translated+suffix);
					}
					// prevent translate attribute value
					string = string.replaceAll('"[@1]"','"'+s+'"');
				}
			} else if (typeof UNTX[x] === 'undefined' && x.length >= 3 && x.length <= 35 && test1.test(x) && test2.test(x) && x.substring(0,4) != 'http') {
				UNTX[x] = 1;
			}
		});
		// for placeholder
		sentences = [];
		_.each(string.split('placeholder="'), function(c,i) {
			if (i) {
				var s = c.split('"')[0];
				if (s) {
					sentences.push(s);
				}
			}
		});
		_.each(sentences, function(s) {
			var x = s.trim().toLowerCase();
			if (TRANSLATE[x]) {
				if (TRANSLATE[x][lang]) {
					string = string.replace('placeholder="'+s+'"','placeholder="'+TRANSLATE[x][lang]+'"');
				}
			} else if (typeof UNTX[x] === 'undefined' && x.length >= 3 && x.length <= 35 && test1.test(x) && test2.test(x) && x.substring(0,4) != 'http') {
				UNTX[x] = 1;
			}
		});
		return string;
	};

	var ohtml = $.fn.html;
	var otext = $.fn.text;
	var oappend = $.fn.append;
	$.fn.html = function(a) {
		if (typeof a === 'string') {
			a = tx(a);
		}
		return ohtml.apply(this, arguments);
	};
	$.fn.text = function(a) {
		if (typeof a === 'string') {
			a = tx(a);
		}
		return otext.apply(this, arguments);
	};
	$.fn.append = function(a) {
		if (typeof a === 'string') {
			a = tx(a);
		}
		return oappend.apply(this, arguments);
	};
});