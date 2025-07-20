const route_path = function() {
	var path = location.pathname.split("/");

	if(typeof path[1] === 'undefined') {
		path = '../views/errors/404.html';
	}
	else {
		switch(path[1]){
			case 'chat':
				if(typeof path[3] !== 'undefined' && path[3] === 'message') path = '../views/message/messages.html';
				else path = '../views/chatlist/chatlist.html';
				break;
			default:
				path = '../views/errors/404.html';
				break;
		}
	}

	console.log(path);

	return path;
};