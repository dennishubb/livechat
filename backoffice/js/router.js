const route_path = function() {
	let path = location.pathname.split("/");
	let merchant_id = '';
	let chat_id = '';
	let params = new URLSearchParams(document.location.search);
	const token = params.get('token');

	console.log(path);

	if(typeof path[1] === 'undefined') {
		path = '../views/errors/404.html';
	}
	else {
		switch(path[1]){
			case 'chat':
				if(typeof path[2] === 'undefined'){
					path = '../views/errors/404.html';
					break;
				}
				merchant_id = path[2];
				if(typeof path[3] !== 'undefined' && path[3] === 'message'){ 
					path = '../views/message/messages.html';
					chat_id = $path[4];
				}
				else{
					 path = '../views/chatlist/chatlist.html';
				}
				break;
			default:
				path = '../views/errors/404.html';
				break;
		}
	}

	console.log(path);

	return path;
};