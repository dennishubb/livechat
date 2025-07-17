define(['lib/sweetalert2.all.min','lib/Autolinker.min','js/Access'], function(swal,Autolinker,Access) {

	// var commonData = {
	// 	apiURL: 'https://'+getApiHost(0)+'/api/v1/index.php',
	// 	endPointURL: endPointURL,
	// 	ipapiURL: 'https://pro.ip-api.com/json/?key=aXn7IV0jBWzTsfN',
	// 	trackingURL: 'https://'+getApiHost(0)+'/mobile/component/tracking.html',
	// 	merchantId: MERCHANTID,
	// 	config: CONFIG,
	// 	currency: null,
	// 	siteName: null
	// };
	
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