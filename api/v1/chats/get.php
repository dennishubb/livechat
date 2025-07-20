<?php

	parse_request(['merchant_id', 'page', 'limit']);

	//default get last 24 hours
	if (empty($merchant_id)) http_response(code:400, message:'invalid merchant');

	$queryLimit = '';
	if(!empty($limit) && !empty($page)) {
		$page = $page * $limit;
		$queryLimit = $queryLimit = "LIMIT ".($page !== ''? "$page, ":'')."$limit"; 
	}

	$updated_at = date('Y-m-d H:i:s', strtotime("-1 day"));

	if(is_array($merchant_id)){
		$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, created_at, updated_at FROM chats WHERE merchant_id IN %li AND updated_at >= %s ORDER BY updated_at DESC $queryLimit", $merchant_id, $updated_at);
	}else{
		$chats = DB::query("SELECT merchant_id, user_id, pinned, pin_id, last_message, last_message_user_id, created_at, updated_at FROM chats WHERE merchant_id = %i AND updated_at >= %s ORDER BY updated_at DESC $queryLimit", $merchant_id, $updated_at);
	}

	http_response(data:$chats);

?>