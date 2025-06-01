<?php

inputParams(['createdDateTime','maCreatedDateTime','pinChatDateTime','maPinChatDateTime']);

if (!empty($maCreatedDateTime)) {
	$maCreatedDateTime = json_decode($maCreatedDateTime,true);
	if (!empty($maCreatedDateTime[$MERCHANT['id']])) {
		$createdDateTime = $maCreatedDateTime[$MERCHANT['id']];
	}
}
if (!empty($maPinChatDateTime)) {
	$maPinChatDateTime = json_decode($maPinChatDateTime,true);
	if (!empty($maPinChatDateTime[$MERCHANT['id']])) {
		$pinChatDateTime = $maPinChatDateTime[$MERCHANT['id']];
	}
}

$PINCHATDATETIME = $rediscache1->get('PINCHATDATETIME-'.$MERCHANT['id']);
if (!empty($PINCHATDATETIME) && (empty($pinChatDateTime) || $PINCHATDATETIME > $pinChatDateTime)) {
	$createdDateTime = '';
}

$mmt = date('Y-m-d H:i:s', strtotime('-12 hours'));
$mdt = $mmt;
if (!empty($createdDateTime)) {
	$tmp = date('Y-m-d H:i:s', strtotime($createdDateTime));
	if ($tmp > $mdt) {
		$mdt = $tmp;
	}
}

if ($USER['role'] === 'KOUNTER') {
	$uIds = $rediscache1->zRevRangeByScore('CHATUSERTIME-'.$MERCHANT['id'], '+inf', strtotime($mdt));
	$mIds = Referrer::getAllMember($USER['id'], $mmt);
	$uIds = array_values(array_intersect($uIds,$mIds));
} else {
	$uIds = $rediscache1->zRevRangeByScore('CHATUSERTIME-'.$MERCHANT['id'], '+inf', strtotime($mdt), ['limit' => [0, 200]]);
}

$pinnedIds = $rediscache1->sMembers('PINCHAT-'.$MERCHANT['id']);
if (!empty($pinnedIds)) {
	$uIds = array_merge($uIds, $pinnedIds);
	$uIds = array_values(array_unique($uIds));
}
$uKeys = [];
foreach ($uIds as $uId) {
	$uKeys[] = 'CHATUSERLASTMESSAGEID-'.$uId;
}
$cIds = $rediscache1->mGet($uKeys);
if (!empty($cIds)) {
	foreach ($cIds as $i => $cId) {
		if (empty($cId)) {
			$cIds[$i] = $wrodb->queryFirstField("SELECT id FROM chat_messages WHERE user_id = %i AND merchant_id = %i ORDER BY id DESC LIMIT 1", $uIds[$i], $MERCHANT['id']);
		}
	}
	$chats = $wrodb->query("SELECT * FROM chat_messages WHERE id IN %li AND merchant_id = %i AND created_datetime > %s", $cIds, $MERCHANT['id'], $mdt);
}

$ret = [];
if (!empty($chats)) {
	$uIds = [];
	foreach ($chats as $c) {
		$uIds[] = $c['user_id'];
		$uIds[] = $c['admin_id'];
	}
	$users = PU::getUserInfo($uIds, ['field' => ['setting']]);
	foreach ($chats as $i => $c) {
		$msg = [
			'id'				=> $c['id'],
			'message'			=> hideTel($c['message'],false),
			'createdDateTime'	=> datec($c['created_datetime']),
			'pinChatDateTime'	=> $PINCHATDATETIME,
			'pinned'			=> 0
		];
		if (!empty($users[$c['user_id']])) {
			$msg['user'] = $users[$c['user_id']];
			if (in_array($c['user_id'], $pinnedIds)) {
				$msg['pinned'] = 1;
				$pinned = PU::cache($msg['user'],'pinchat');
				if (!empty($pinned)) {
					$msg['pinned'] = $pinned;
				}
			}
		}
		if (!empty($users[$c['admin_id']])) {
			$msg['admin'] = $users[$c['admin_id']];
		}
		$ret[] = $msg;
	}
}

$data = maMergeResponse($ret);

usort($data, function($a, $b) {
	if ($a['createdDateTime'] > $b['createdDateTime']) {
		return -1;
	} elseif ($a['createdDateTime'] < $b['createdDateTime']) {
		return 1;
	}
	return 0;
});

$data = array_slice($data,0,200);

returnAPI('SUCCESS', $data);
?>