<?php

	parse_request(['merchant_id', 'start', 'end', 'page', 'limit', 'get_pin']);

	if (empty($merchant_id)) http_response(code:400, message:'invalid merchant');

	if (empty($start)) $start = date('Y-m-d H:i:s', strtotime('-12 hours'));
	else $start = date('Y-m-d H:i:s', strtotime($start));

	if(empty($end)) $end = date('Y-m-d H:i:s');
	else $end = date('Y-m-d H:i:s', strtotime($end));

	$queryLimit = '';
	if(empty($limit)) $limit = 200;
	if(empty($page)) $page = 0;
	else { $page = $page * $limit; $queryLimit = "LIMIT ".($page !== ''? "$page, ":'')."$limit"; }

	$res = [];
	if(is_array($merchant_id)) {
		if($get_pin){
			$pinned = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id IN %li AND status = %i AND pinned = %i ORDER BY updated_at DESC", $merchant_id, 1, 1);
			$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id IN %li AND status = %i AND pinned = %i AND updated_at BETWEEN %s AND %s ORDER BY updated_at DESC $queryLimit", $merchant_id, 1, 0, $start, $end);
		}else{
			$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id IN %li AND status = %i AND pinned IN (0,1) AND updated_at BETWEEN %s AND %s ORDER BY updated_at DESC $queryLimit", $merchant_id, 1, 0, $start, $end);
		}
	}
	else {
		if($get_pin){
			$pinned =  DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id = %i AND status = %i AND pinned = % ORDER BY updated_at DESC", $merchant_id, 1, 1);
			$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id = %i AND status = %i AND pinned = %i AND updated_at BETWEEN %s AND %s ORDER BY updated_at DESC $queryLimit", $merchant_id, 1, 0, $start, $end);
		}else{
			$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, updated_at FROM chats WHERE merchant_id = %i AND status = %i AND pinned IN (0,1) AND updated_at BETWEEN %s AND %s ORDER BY updated_at DESC $queryLimit", $merchant_id, 1, 0, $start, $end);
		}
	}

	$res = ['pinned' => $pinned, 'chats' => $chats];

	http_response(data:$res);

?>