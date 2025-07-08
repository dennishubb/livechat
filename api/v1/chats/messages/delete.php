<?php
	include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'message_id']);

    $message = Message::Load($message_id);

    if(!$message->has('id')) http_response(code:400);
    if($message->merchant_id != $merchant_id) http_response(code:403);

    $message->status = 2;
    $message->updated_at = $NOW;
    $message->save();

    http_response();
?>