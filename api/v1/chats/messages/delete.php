<?php
	include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'message_id']);

    $message = Message::Load($message_id);

    if($message === null) http_response(code:404);
    if($message->merchant_id != $merchant_id) http_response(code:403);

    $message->status = 2;
    $message->updated_at = $NOW;
    $message->save();

    http_response(data:['user_id' => $message->user_id]);
?>