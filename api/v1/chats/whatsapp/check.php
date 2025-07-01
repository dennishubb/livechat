<?php

//

parse_request(['mobile', 'merchant_id']);

if(empty($mobile)) http_response(code:400);
if(empty($merchant_id)) http_response(code:400);

$mdt = date('Y-m-d H:i:s', strtotime('-10 minutes'));
$chats = DB::query("SELECT id, user_id, message FROM messages WHERE merchant_id = %i AND source = %s AND status = %i AND admin_id IS NOT NULL AND created_at > %s AND admin_id IS NOT NULL AND source = %s AND status IS NULL LIMIT 30", $MERCHANT['id'], $mdt, 'WHATSAPP');

if (empty($chats)) {
	http_response();
}

// $userIds = [];
// foreach ($chats as $c) {
// 	if (!in_array($c['user_id'], $userIds)) {
// 		$userIds[] = $c['user_id'];
// 	}
// }

// $users = $wrodb->query("SELECT id, mobile FROM users WHERE id IN %li AND attending_mobile = %s", $userIds, $attendingMobile);

// if (empty($users)) {
// 	returnAPI('SUCCESS');
// }

// $mobileIndex = [];
// foreach ($users as $u) {
// 	$mobileIndex[$u['id']] = $u['mobile'];
// }

$msgs = [];
foreach ($chats as $c) {
	if (empty($mobileIndex[$c['user_id']])) {
		continue;
	}
	$mobile = $mobileIndex[$c['user_id']];
	if (isset($msgs[$mobile])) {
		array_push($msgs[$mobile], ['id' => $c['id'], 'message' => randStr($c['message'])]);
	} else {
		$msgs[$mobile] = [['id' => $c['id'], 'message' => randStr($c['message'])]];
	}
}

$messages = [];
$count = 0;
foreach ($msgs as $k => $v) {
	$messages[] = ['mobile' => $k, 'messages' => $v];
	$count++;
	if ($count == 3) {
		break;
	}
}

returnAPI('SUCCESS', $messages);

?>