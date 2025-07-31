<?php

parse_request(['chat_id', 'pin_id']);

if(empty($user_id)) http_response(code:400, message:'invalid user');

include(ROOT.'/model/chat.php');

$chat = Chat::Load($chat_id);
if($chat === null) http_response(code:404);

$chat->pin_id = empty($pin_id) ? 0 : $pin_id;
$chat->pinned = empty($pin_id) ? 0 : 1;
$chat->save();

http_response();

?>