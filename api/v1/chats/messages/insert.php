<?php

    parse_request(['merchant_id', 'user_id', 'admin_id', 'message', 'source', 'status', 'created_datetime', 'template_id']);

    if(empty($user_id) || empty($merchant_id)) http_response(code:400); 

    //create or update chatroom whenever a message is sent
    include(ROOT.'/model/chat.php');
    $chat = Chat::Search("SELECT id FROM chats WHERE user_id = $i AND merchant_id = %i", $user_id, $merchant_id);
    if($chat === null){
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
        $chat_id = $chat->id;
    }
    
    include(ROOT.'/model/message.php');
    $chat_message = new Message();

    $chat_message->merchant_id   = $merchant_id;
    $chat_message->user_id       = $admin_id ? $admin_id : $user_id;
    $chat_message->message       = $message;
    $chat_message->source        = $source;
    $chat_message->template_id   = empty($template_id) ? 0 : $template_id;
    $chat_message->chat_id       = $chat_id;
    $chat_message->save();
    $res['id'] = DB::insertId();

    http_response(data:$res);

?>