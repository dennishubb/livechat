<?php

	//input
	//merchant_id = single or array
	//start
	//end
	//page
	//limit

	include(ROOT.'/model/chats.php');

	inputParams(['merchant_id', 'start', 'end', 'page', 'limit']);

	if (empty($merchant_id)) exit();

	if (empty($start)) {
		$start = date('Y-m-d H:i:s', strtotime('-12 hours'));
	}else{
		$start = date('Y-m-d H:i:s', strtotime($start));
	}

	if(!empty($end)){
		$end = date('Y-m-d H:i:s', strtotime($end));
	}

	if(empty($limit)) $limit = '';
	if(empty($page)) $page = '';
	else $page = $page * $limit;

	//any pinned will be selected first

	$chat = new Chat();
	$chats = $chat::scope('is_merchant', $merchant_id)->scope('is_pinned')->dirtyHash()->toArray();

	print_r($chats);

	// $ret = [];
	// if (!empty($chats)) {
	// 	$uIds = [];
	// 	foreach ($chats as $c) {
	// 		$uIds[] = $c['user_id'];
	// 		$uIds[] = $c['admin_id'];
	// 	}
	// 	$users = PU::getUserInfo($uIds, ['field' => ['setting']]);
	// 	foreach ($chats as $i => $c) {
	// 		$msg = [
	// 			'id'				=> $c['id'],
	// 			'message'			=> hideTel($c['message'],false),
	// 			'createdDateTime'	=> datec($c['created_datetime']),
	// 			'pinChatDateTime'	=> $PINCHATDATETIME,
	// 			'pinned'			=> 0
	// 		];
	// 		if (!empty($users[$c['user_id']])) {
	// 			$msg['user'] = $users[$c['user_id']];
	// 			if (in_array($c['user_id'], $pinnedIds)) {
	// 				$msg['pinned'] = 1;
	// 				$pinned = PU::cache($msg['user'],'pinchat');
	// 				if (!empty($pinned)) {
	// 					$msg['pinned'] = $pinned;
	// 				}
	// 			}
	// 		}
	// 		if (!empty($users[$c['admin_id']])) {
	// 			$msg['admin'] = $users[$c['admin_id']];
	// 		}
	// 		$ret[] = $msg;
	// 	}
	// }

	// $data = maMergeResponse($ret);

	// usort($data, function($a, $b) {
	// 	if ($a['createdDateTime'] > $b['createdDateTime']) {
	// 		return -1;
	// 	} elseif ($a['createdDateTime'] < $b['createdDateTime']) {
	// 		return 1;
	// 	}
	// 	return 0;
	// });

	// $data = array_slice($data,0,200);

	http_response(data:$chats);

?>