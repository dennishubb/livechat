let merchant_id = '';
let chat_id = '';
let token = '';
let user_id = 1101;

//{merchant_id}/chats/{user_id} << registered
//{merchant_id}/chats << not registered

const route_path = function() {
	let paths = location.pathname.split("/");
	let params = new URLSearchParams(document.location.search);
	token = params.get('token');

	if(typeof paths[1] === 'undefined' || typeof paths[2] === 'undefined') {
		path = '../views/errors/404.html';
	}
	else {
		merchant_id = paths[1];
		switch(paths[2]){
			case 'chat':
				path = '../views/chatroom/chatroom.html';
				if(typeof paths[3] !== 'undefined') user_id = paths[3];
				break;
			default:
				path = '../views/errors/404.html';
				break;
		}
	}

	return path;
};