function route_path() {
	
	var path = location.pathname.split("/");

	return path;
}

exports.route_path = route_path;