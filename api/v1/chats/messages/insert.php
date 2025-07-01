<?php

    include(ROOT.'/model/message.php');

    parse_request(['merchant_id', 'user_id', 'admin_id', 'message', 'source', 'status', 'created_datetime']);

    include(ROOT.'/model/chat.php');

    //create or update chatroom whenever a message is sent
    $chat = Chat::Search("SELECT id FROM chats WHERE user_id = $i", $user_id);
    if(!isset($chat->id)){
        $chat = new Chat();
        $chat->merchant_id = $merchant_id;
        $chat->user_id = $user_id;
        $chat->last_message = $message;
        $chat->last_message_user_id = $user_id;
        $chat->save();
        $chat_id = DB::insertId();
    }else{
        $chat->last_message = $message;
        $chat->last_message_user_id = $admin_id ? $admin_id : $user_id;
        $chat->save();
    }
    
    $message = new Message();

    $message->merchant_id   = $merchant_id;
    $message->user_id       = $admin_id ? $admin_id : $user_id;
    $message->message       = $message;
    $message->source        = $source;
    $message->status        = $status;
    $message->created_at    = $created_datetime;
    $message->updated_at    = $created_datetime;
    if(!empty($chat_id)) $message->chat_id = $chat_id;
    $message->save();
    $res['id'] = DB::insertId();

    http_response(data:$res);

?>