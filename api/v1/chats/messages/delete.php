<?php
	include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'message_id']);

    $message = new Message();
    $message::Load($message_id);

    if(!isset($message->id)) http_response(code:400);
    if($message->merchant_id != $merchant_id) http_response(code:403);

    $message->status = 2;
    $message->updated_at = $NOW;
    $message->save();

    http_response();
?>