const route_path = function() {
	var path = location.pathname.split("/");

	if(typeof path[1] === 'undefined') {
		path = '../views/errors/404.html';
	}
	else {
		switch(path[1]){
			case 'chat':
				path = '../views/chatlist/chatlist.html';
				break;
			default:
				path = '../views/errors/404.html';
				break;
		}
	}

	return path;
};