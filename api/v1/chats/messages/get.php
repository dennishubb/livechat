<?php

parse_request(['user_id', 'merchant_id', 'page', 'limit', 'last', 'replies_only', 'field']);

if(empty($user_id) || empty($merchant_id)) http_response(code:400, message:"invalid id");

include_once(ROOT.'/model/chat.php');

$chat = Chat::Search(['user_id' => $user_id, 'merchant_id' => $merchant_id]);
if(!$chat) http_response(code:404, message:'chat not found');

if($last) {
    if($replies_only) $res = DB::query("SELECT $field FROM messages WHERE user_id != %i ORDER BY created_at DESC limit $last", $user_id);
    else $res = DB::query("SELECT $field FROM messages WHERE user_id = %i ORDER BY created_at DESC limit $last", $user_id);
}else{
    $queryLimit = '';
    if(empty($limit)) $limit = 200;
    if(empty($page)) $page = '';
    else { $page = $page * $limit; $queryLimit = "LIMIT ".($page !== ''? "$page, ":'')."$limit"; }

    $user_ids = DB::query("SELECT DISTINCT(user_id) FROM messages WHERE chat_id = %i AND status = %i ORDER BY created_at DESC LIMIT 200", $chat->id, 1);
    $messages = DB::query("SELECT id, user_id, (CASE status WHEN 1 THEN NULL WHEN 2 THEN 'DELETED' ELSE '' END) AS status, source, created_at, message FROM messages WHERE chat_id = %i AND status = %i ORDER BY created_at DESC limit 200", $chat->id, 1);
    $res['messages'] = $messages;
    $res['user_ids'] = $user_ids;
    $res['pinned']   = $chat->pinned;
}

http_response(data: $res);

?>