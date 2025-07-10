<?php

    parse_request(['merchant_id', 'user_id', 'admin_id', 'text', 'source', 'status', 'created_datetime', 'template_id']);

    if(empty($user_id) || empty($merchant_id)) http_response(code:400); 

    //create or update chatroom whenever a message is sent
    include(ROOT.'/model/chat.php');
    $chat = Chat::Search("SELECT id FROM chats WHERE user_id = $i AND merchant_id = %i", $user_id, $merchant_id);
    if($chat === null){
        $chat = new Chat();
        $chat->merchant_id = $merchant_id;
        $chat->user_id = $user_id;
        $chat->last_message = $text;
        $chat->last_message_user_id = $user_id;
        $chat->save();
        $chat_id = DB::insertId();
    }else{
        $chat->last_message = $text;
        $chat->last_message_user_id = $admin_id ? $admin_id : $user_id;
        $chat->save();
        $chat_id = $chat->id;
    }
    
    include(ROOT.'/model/message.php');
    $message = new Message();

    $message->merchant_id   = $merchant_id;
    $message->user_id       = $admin_id ? $admin_id : $user_id;
    $message->message       = $text;
    $message->source        = $source;
    $message->template_id   = empty($template_id) ? 0 : $template_id;
    $message->chat_id       = $chat_id;
    $message->save();
    $res['id'] = DB::insertId();

    http_response(data:$res);

?>