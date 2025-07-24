$(function() {

	//initialize styles and html
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/main/main.css">');
	$('head').append('<link rel="stylesheet" type="text/css" href="/views/main/cssA.css">');

	const newmessagesound = new Audio('/views/audio/chat.mp3');

	setInterval(() => {
		
	}, 5000);

	function playAudio(track) {
		if (localStorage.getItem('CHATSOUND') === 'off') {
			return;
		}
		newmessagesound.volume = 1;
		newmessagesound.pause();
		newmessagesound.currentTime = 0;
		newmessagesound.play();
	};

});