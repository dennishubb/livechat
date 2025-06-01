<?php
checkUser(['type' => ['ADMIN','PUBLIC'], 'mobile' => 0]);

inputParams(['userId','getTemplate','getPin']);

if ($USER['type'] === 'PUBLIC') {
	$userId = $USER['id'];
}

if (!checkInt($userId)) clientErrorMessage('Invalid User ID.');

$chats = $wrodb->query("SELECT id, user_id, admin_id, status, source, created_datetime, message FROM chat_messages WHERE user_id = %i AND merchant_id = %i ORDER BY created_datetime DESC LIMIT 200", $userId, $MERCHANT['id']);

if(isGServer() && $userId == 2267197){
	$chats = $wrodb->query("SELECT id, user_id, admin_id, status, source, created_datetime, message FROM chat_messages WHERE user_id = %i AND merchant_id = %i AND created_datetime >= '2024-09-25 16:00:00' ORDER BY created_datetime DESC", $userId, $MERCHANT['id']);
}

$uIds = [$userId];

foreach ($chats as $c) {
	if($c['status'] === 'DELETED') continue;
	$uIds[] = $c['user_id'];
	$uIds[] = $c['admin_id'];
}
$users = PU::getUserInfo($uIds);

$messages = [];
$count = 0;
foreach ($chats as $i => $c) {
	if($c['status'] === 'DELETED') continue;

	$messageData = [
		'id'				=> $c['id'],
		'source'			=> $c['source'],
		'status'			=> $c['status'],
		'message'			=> hideTel($c['message'],false),
		'createdDateTime'	=> datec($c['created_datetime'])
	];
	if (!empty($users[$c['admin_id']])) {
		$messageData['admin'] = $users[$c['admin_id']];
	}
	$messages[$count] = $messageData;
	
	$count++;
}

$ret = ['messages' => $messages];

if ($USER['type'] === 'ADMIN') {
	$ret['user'] = null;
	if (!empty($users[$userId])) {
		$ret['user'] = $users[$userId];
	}
	if (!empty($getTemplate)) {
		$user = $wrodb->queryFirstRow("SELECT * FROM users WHERE id = %i", $userId);
		if (empty($DOMAIN['id']) && !empty($user['domain_id'])) {
			$DOMAIN = DB::queryFirstRow("SELECT * FROM domain WHERE merchant_id = %i AND id = %i", $MERCHANT['id'], $user['domain_id']);
			Domain::overwrite();
		}
		$ret['templates'] = Chat::getTemplates($user);
	}
	if (!empty($getPin)) {
		$ret['pinchat'] = $redischat->sIsMember('PINCHAT-'.$MERCHANT['id'], $userId) ? 1 : 0;
	}
}

returnAPI('SUCCESS', $ret);
?>