<?php
checkUser('SYSTEM');

inputParams(['attendingMobile']);

$attendingMobile = checkPhone($attendingMobile);

if (empty($attendingMobile)) clientErrorMessage('Invalid Attending Mobile!');

$mdt = date('Y-m-d H:i:s', strtotime('-10 minutes'));

$chats = $wrodb->query("SELECT id, user_id, message FROM chat_messages WHERE merchant_id = %i AND created_datetime > %s AND admin_id IS NOT NULL AND source = %s AND status IS NULL LIMIT 30", $MERCHANT['id'], $mdt, 'WHATSAPP');

if (empty($chats)) {
	returnAPI('SUCCESS');
}

$userIds = [];
foreach ($chats as $c) {
	if (!in_array($c['user_id'], $userIds)) {
		$userIds[] = $c['user_id'];
	}
}

$users = $wrodb->query("SELECT id, mobile FROM users WHERE id IN %li AND attending_mobile = %s", $userIds, $attendingMobile);

if (empty($users)) {
	returnAPI('SUCCESS');
}

$mobileIndex = [];
foreach ($users as $u) {
	$mobileIndex[$u['id']] = $u['mobile'];
}

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

function randStr($str) {
	$res = "";
	$chars = str_split($str);
	foreach ($chars as $c) {
		if ($c == ":") {
			$stop = 2;
		}
		if ($c == " ") {
			if (empty($stop)) {
				$p = rand(0,30);
				if ($p == 1) {
					$res.= " `";
				} else if ($p == 2) {
					$res.= " *";
				} else if ($p == 3) {
					$res.= " ^";
				} else if ($p == 4) {
					$res.= " '";
				} else if ($p == 5) {
					$res.= " -";
				}
			} else {
				$stop--;
			}
		}
		$res.= $c;
	}
	return $res;
}
?>