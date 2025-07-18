console.log('router');

function route_path() {
	console.log('route path');
	var path = location.pathname.split("/");

	return path;
}

exports.route_path = route_path;