define(function(require) {

	var Backbone = require('backbone');

	var v = {};

	v['chat'] = require('views/chatlist/chatlist');

	var Router = Backbone.Router.extend({
		routes: _.extend(_.object(_.keys(v),_.keys(v)),{'*notfound':'notfound'})
	});

	var router = new Router();

	router.on('route', function(route,params) {
		var hash = window.location.hash;
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