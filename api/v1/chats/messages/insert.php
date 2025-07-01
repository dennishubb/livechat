<?php

    include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'user_id', 'admin_id', 'message', 'source', 'status', 'created_datetime']);

    $message = new Message();

    $message->merchant_id   = $merchant_id;
    $message->user_id       = $admin_id ? $admin_id : $user_id;
    $message->message       = $message;
    $message->source        = $source;
    $message->status        = $status;
    $message->created_at    = $created_datetime;
    $message->updated_at    = $created_datetime;
    $message->save();
    $res['id'] = DB::insertId();

    http_response(data:$res);

?>