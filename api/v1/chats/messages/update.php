<?php

    include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'message_id', 'status']);

    $message = Message::Load($message_id);

    if(!$message->has('id')) http_response(code:404);

    if($message->merchant_id != $merchant_id) http_response(code:403);
    if(!in_array($status, ['SKIPPED','SENT'])) http_response(code:400);

    $message->status     = $status === 'SKIPPED'?3:4;
    $message->updated_at = $NOW;
    $message->save();

    http_response();

?>