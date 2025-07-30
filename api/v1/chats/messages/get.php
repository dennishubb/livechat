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

$messages = DB::query("SELECT a.id, a.user_id, a.status, a.source, a.created_at, a.message, b.name 
FROM messages a INNER JOIN users b 
ON a.merchant_id = b.merchant_id AND a.user_id = b.user_id
WHERE a.chat_id = %i ORDER BY a.created_at DESC limit 100", $chat->id);

$res['messages'] = $messages;
$res['chat']['user_id'] = $chat->user_id;
$res['chat']['user_name'] = DB::queryFirstField("SELECT name FROM users WHERE merchant_id = %i AND user_id = %i", $merchant_id, $chat->user_id);
$res['chat']['pin_id'] = $chat->pin_id;

http_response(data: $res);

?>