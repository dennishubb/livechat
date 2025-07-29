<?php

parse_request(['chat_id', 'user_id', 'merchant_id']);

if(empty($merchant_id)) http_response(code:400, message:"invalid merchant");
if(empty($chat_id) && empty($user_id)) http_response(code:400, message:"invalid id");

include_once(ROOT.'/model/chat.php');

if(empty($chat_id)){ $chat = Chat::Search(['user_id' => $user_id, 'merchant_id' => $merchant_id]); }
else{ $chat = Chat::Load($chat_id); }

if(!$chat) http_response(code:404, message:'chat not found');

// $queryLimit = '';
// if(empty($limit)) $limit = 200;
// if(empty($page)) $page = '';
// else { $page = $page * $limit; $queryLimit = "LIMIT ".($page !== ''? "$page, ":'')."$limit"; }

$updated_at = date('Y-m-d H:i:s', strtotime('-1 day'));

$messages = DB::query("SELECT id, user_id, status, source, created_at, message FROM messages WHERE chat_id = %i AND updated_at >= %s ORDER BY created_at DESC ", $chat_id, $updated_at);
$chat = (array) $chat;

$res['messages'] = $messages;
$res['chat'] = $chat;

http_response(data: $res);

?>