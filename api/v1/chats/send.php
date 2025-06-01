<?php
//checkUser('OPEN','ADMIN','PUBLIC');

// if (Setting::get('LiveChatMustLogin') == 2) {
// 	clientErrorMessage('Live Chat Is Disabled.');
// }

// if (Setting::get('LiveChatMustLogin') == 1 && empty($USER)) {
// 	clientErrorMessage('Please Login To Use Live Chat.');
// }

// if (empty($USER)) {
// 	captchaValidate();
// }

//problem: i dont have $USER, i need to know where the data is from, public, admin etc
//solution: create an API key for admin, admin need to pass this key in the API to identify as admin user

//problem: main wallet creates a livechat user
//solution: for us, we'll create a chatroom instead

//can 

validateInput([
	'userId' => ['type' => 'INT', 'optional' => 1],
	'whatsapp' => ['type' => 'INT', 'optional' => 1],
]);

//
if (!empty($USER) && $USER['type'] === 'ADMIN') {
	inputParams(['message'],false);
} else {
	inputParams(['message']);
}

if (!empty($_FILES['file']['tmp_name'])) {
	$tmp = processUploadedFile($_FILES['file'],8);
	$message = $tmp['fileURL'];
}

if (strpos($message, 'data:') === 0) {
	$message = s3Upload($message);
}

if (empty($message)) clientErrorMessage('Invalid Message.');

$ret = null;
if (empty($USER)) {
	$USER = PU::create();
	$ret = ['id' => $USER['id'], 'name' => $USER['name'], 'token' => PU::token($USER)];
}

if ($USER['type'] === 'PUBLIC') {
	$message = htmlspecialchars($message);
	$autoreply = ['user' => $USER, 'body' => $message];
	Chat::insert(['merchant_id' => $MERCHANT['id'], 'user_id' => $USER['id'], 'message' => $message, 'source' => 'LIVECHAT'], $autoreply);
} else {
	if (!checkInt($userId)) clientErrorMessage('Invalid User ID.');
	$user = DB::queryFirstRow("SELECT * FROM users WHERE merchant_id = %i AND id = %i", $MERCHANT['id'], $userId);
	if (empty($user)) clientErrorMessage('Invalid User!');
	Chat::send($user, $message, $whatsapp);
}

returnAPI('SUCCESS',$ret);
?>