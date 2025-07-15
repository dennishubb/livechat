
define(function(require) {

    var Backbone    = require('backbone'),
        tpl         = require('text!views/main/editor/editor.html');

    return Backbone.View.extend({
        
        id: 'main-editor',

        initialize: function(options) {
            this.template = _.template(tpl);
            this.type = options.type;
            this.value = options.value;
            this.title  = options.title || 'EDITOR';
            this.hideType = options.hideType || false;
            this.manualClose = options.manualClose || false;
            this.onSuccess = options.onSuccess;
        },

        render: function() {
            var self  = this;

            self.popUpWindow = MainView.popUpWindow(self, self.title);
            self.$el.html(self.template({}));
            if(self.hideType) {
                self.$el.find('.typeOptions').hide();
            }
            else {
                if(this.type.includes('html')) this.type = 'htmlmixed';
                self.$el.find('.typeOptions').val(this.type);    
            }
            self.iframe = document.getElementsByClassName('iframe-page')[0];
            MainView.editorHandleMessage = function(event) {
                if (event.source === self.iframe.contentWindow) {
                    if (event.data.status === 'codeMirrorListening') {
                        self.origin = event.origin;
                        var dataToSend = {
                            type: self.type,
                            value: self.value
                        };
                        self.iframe.contentWindow.postMessage(dataToSend, self.origin);
                    }
                    if (event.data.hasOwnProperty('getValue')) {
                        if(event.data.type === 'error') {
                            _.confirm('The text got error, are you sure to continue?', function(e) {
                               self.closeDialog(event.data.getValue);
                            })
                        }
                        else {
                            self.closeDialog(event.data.getValue);
                        }
                    }
                }
            };       
        },
        closeDialog: function(value){
            var self = this;
            self.onSuccess(value);
            if(!self.manualClose) {
                MainView.popUpWindow('close');
            }
        },
        events: {
            'change .typeOptions': function(e) {
				var self = this;
				var type = $(e.currentTarget).val();
                var dataToSend = {
                    msg: 'setOptions',
                    type: type
                };
                self.iframe.contentWindow.postMessage(dataToSend, self.origin);
			},
            'click .save': function(e) {
				var self = this;
                var dataToSend = {
                    msg: 'getValue'
                } 
                self.iframe.contentWindow.postMessage(dataToSend, self.origin);
			},
            'click .close': function(e) {
                MainView.popUpWindow('close');
			}
        }
    })
})