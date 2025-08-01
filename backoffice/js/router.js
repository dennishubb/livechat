let merchant_id = '';
let chat_id = '';
let token = '';
let user_id = 1002;

const route_path = function() {
	let paths = location.pathname.split("/");
	let params = new URLSearchParams(document.location.search);
	token = params.get('token');

	if(typeof paths[1] === 'undefined') {
		path = '../views/errors/404.html';
	}
	else {
		switch(paths[1]){
			case 'chat':
				if(typeof paths[2] === 'undefined'){
					path = '../views/errors/404.html';
					break;
				}
				merchant_id = parseInt(paths[2]);
				if(typeof paths[3] !== 'undefined' && paths[3] === 'message' && typeof paths[4] !== 'undefined'){ 
					path = '../views/message/messages.html';
					chat_id = parseInt(paths[4]);
				}else if(paths.length === 3){
					path = '../views/chatlist/chatlist.html';
				}else{
					path = '../views/errors/404.html';
				}
				break;
			default:
				path = '../views/errors/404.html';
				break;
		}
	}

	return path;
};