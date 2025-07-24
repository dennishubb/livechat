<?php

parse_request(['chat_id', 'merchant_id']);

if(empty($chat_id) || empty($merchant_id)) http_response(code:400, message:"invalid id");

include_once(ROOT.'/model/chat.php');

// $chat = Chat::Load($chat_id);
// if(!$chat) http_response(code:404, message:'chat not found');

// $queryLimit = '';
// if(empty($limit)) $limit = 200;
// if(empty($page)) $page = '';
// else { $page = $page * $limit; $queryLimit = "LIMIT ".($page !== ''? "$page, ":'')."$limit"; }

$updated_at = date('Y-m-d H:i:s', strtotime('-1 day'));

$res = DB::query("SELECT id, user_id, status, source, created_at, message FROM messages WHERE chat_id = %i AND updated_at >= %s ORDER BY created_at DESC ", $chat_id, $updated_at);

http_response(data: $res);

?>