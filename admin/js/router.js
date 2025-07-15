define(function(require) {

	var Backbone = require('backbone');
	var User = require('models/User');

	var v = {};

	v['admins']						= require('views/admins/admins');
	v['adminTool(/:domainId)']		= require('views/adminTool/adminTool');
	v['api']						= require('views/api/api');
	v['banks']						= require('views/banks/banks');
	v['bankTx']						= require('views/bankTx/bankTx');
	v['blacklist']					= require('views/blacklist/blacklist');
	v['chatlist']					= require('views/chatlist/chatlist');
	v['chatroom/:userId(/:mamId)']	= require('views/chatroom/chatroom');
	v['commission(/:domainId)']		= require('views/commission/commission');
	v['counter']					= require('views/counter/counter');
	v['css(/:domainId)']			= require('views/css/css');
	v['gameKey']					= require('views/gameKey/gameKey');
	v['domain']						= require('views/domain/domain');
	v['game']						= require('views/game/game');
	v['layout(/:domainId)']			= require('views/layout/layout');
	v['game/report']				= require('views/game/report/report');
	v['login']						= require('views/login/login');
	v['multidomain']				= require('views/multidomain/multidomain');
	v['multiTool']					= require('views/multiTool/multiTool');
	v['password(/:next)']			= require('views/password/password');
	v['payment']					= require('views/payment/payment');
	v['promotions(/:domainId)']		= require('views/promotions/promotions');
	v['rebate']						= require('views/rebate/rebate');
	v['referrer']					= require('views/referrer/referrer');
	v['reports/:type(/:domainId)']	= require('views/reports/reports');
	v['security']					= require('views/security/security');
	v['settings(/:domainId)']		= require('views/settings/settings');
	v['smsBlast']					= require('views/smsBlast/smsBlast');
	v['soccer(/:filter)']			= require('views/soccer/soccer');
	v['soccerMatch']				= require('views/soccerMatch/soccerMatch');
	v['status']						= require('views/status/status');
	v['template(/:domainId)']		= require('views/template/template');
	v['theme(/:domainId)']			= require('views/theme/theme');
	v['telegram']					= require('views/telegram/telegram');
	v['tools']						= require('views/tools/tools');
	v['page']						= require('views/page/page');
	v['transactions']				= require('views/transactions/transactions');
	v['translate']					= require('views/translate/translate');
	v['userMgmt']					= require('views/userMgmt/userMgmt');
	v['users(/:filter)']			= require('views/users/users');
	v['apiSettings']				= require('views/apiSettings/apiSettings');
	v['changelog']					= require('views/changelog/changelog');

	var Router = Backbone.Router.extend({
		routes: _.extend(_.object(_.keys(v),_.keys(v)),{'*notfound':'notfound'})
	});

	var router = new Router();

	router.on('route', function(route,params) {
		var hash = window.location.hash;
		if (route.indexOf('password') !== 0 && User.get('id') && !User.get('cashSiteDatetime')) {
			window.location.href = '#password/'+encodeURIComponent(hash.replace('#',''));
			return;
		}
		if (route === 'notfound') {
			window.location = document.URL.split('#')[0];
		} else {
			var options = {};
			var tmp = route.split('/');
			if (tmp.length > 1) {
				_.each(tmp, function(param,i) {
					i && (options[param.replace(/\W/g,'')] = params[i-1]);
				});
			}
			if (options) {
				if (options.domainId) {
					hash = hash.replace('/'+options.domainId, '');
				} else if (hash.indexOf('users') >= 0) {
					hash = '#users';
				}
			}
			var needcheck = _.reduce(['chatroom','game/report','login','multi','password','soccer','template'], function(a,b) { return a && hash.indexOf(b) < 0; }, true);
			if (needcheck && _.checkAccess(User.get('role'), hash) === false) {
				return;
			}
			new v[route](options).render();
		}
	});

	return router;

});