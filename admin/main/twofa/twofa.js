define(function(require) {
	
	var Backbone	= require('backbone'),
		tpl			= require('text!views/main/twofa/twofa.html');
	
	return Backbone.View.extend({
		
		id: 'main-twofa',
		
		initialize: function(options) {
			this.template = _.template(tpl);
		},
		
		render: function() {
			var self = this;
			$.post('/tool/twofaGetSecretKey', function(data) {
				self.$el.html(self.template({}));
				self.popUpWindow = MainView.popUpWindow(self, 'Setup 2FA - Google Authenticator');
				self.$el.find('input[name="secretKey"]').val(data.secretKey);
				self.$el.find('img').attr('src', data.qrCodeUrl);
			});
			return this;
		},
		
		events: {
			'click .submit': function(e) {
				var secretKey = this.$el.find('[name="secretKey"]').val();
				var passcode = this.$el.find('[name="passcode"]').val();
				if (secretKey && passcode) {
					$.post('/tool/twofaSaveSecretKey', {secretKey:secretKey,passcode:passcode}, function() {
						_.alert({type:'success',title:'',text:'Setup 2FA Successfully.'});
						MainView.popUpWindow('close');
					});
				}
			},
			'click .generate': function(e) {
				var self = this;
				var secretKey = this.$el.find('[name="secretKey"]').val();
				if (secretKey) {
					$.post('/tool/twofaGetSecretKey', {secretKey:secretKey}, function(data) {
						self.$el.find('input[name="secretKey"]').val(data.secretKey);
						self.$el.find('img').attr('src', data.qrCodeUrl);
					});
				}
			},
			'click .close': function(e) {
				MainView.popUpWindow('close');
			}
		}
	});
});