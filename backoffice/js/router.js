console.log('router');

const route_path = function() {
	console.log('route path');
	var path = location.pathname.split("/");
	console.log(path);
	return path;
};