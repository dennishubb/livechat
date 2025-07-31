<?php

    parse_request(['merchant_id', 'chat_id', 'user_id', 'file', 'message', 'source', 'status', 'created_datetime', 'template_id', 'template_type']);

    if(empty($user_id) || empty($merchant_id)) http_response(code:400); 

    if(!empty($template_id) && $template_id !== 0){
        $message = DB::queryFirstField("SELECT message FROM templates WHERE id = %i", $template_id);
        if(empty($message)) http_response(code:400, message:"invalid template");
    }
    if(!empty($template_type)){
        //get default if merchant didnt set a message
        $template = DB::queryFirstRow("SELECT id, message FROM templates WHERE merchant_id = %i AND type = %s", $merchant_id, $template_type);
        if(empty($template)) $template = DB::queryFirstRow("SELECT id, message FROM templates WHERE merchant_id = %i AND type = %s", 0, $template_type);
        if(!empty($template)){$message = $template['message']; $template_id = $template['id'];}
        else http_response(code:400, message:"invalid template");
    }
    if (!empty($_FILES['file']['tmp_name'])) {
        $tmp = processUploadedFile($_FILES['file'],8);
        $message = $tmp['fileURL'];
    }

    //create or update chatroom whenever a message is sent
    include(ROOT.'/model/chat.php');
    $chat = Chat::Load($chat_id);
    if($chat === null){
        $chat = new Chat();
        $chat->merchant_id = $merchant_id;
        $chat->user_id = $user_id;
        $chat->last_message = $message;
        $chat->last_message_user_id = $user_id;
        $chat->save();
    }else{
        $chat->last_message = $message;
        $chat->last_message_user_id = $user_id;
        $chat->save();
    }

    //admin
    // if ($chat->user_id !== $user_id) {
    //     $rediscache->del('MERCHANTNEWCHAT-'.$merchant_id);
    // } else {
    //     $rediscache->set('MERCHANTNEWCHAT-'.$data['merchant_id'], $NOW, 10);
    //     //$rediscache->set('LAST-'.$data['merchant_id'].'-'.$data['user_id'], json_encode(['source' => $data['source'], 'created_datetime' => $data['created_datetime']]), 86400);
    // }
    
    include(ROOT.'/model/message.php');
    $chat_message = new Message();

    $chat_message->merchant_id   = $merchant_id;
    $chat_message->user_id       = $user_id;
    $chat_message->message       = $message;
    $chat_message->source        = $source;
    $chat_message->template_id   = empty($template_id) ? 0 : $template_id;
    $chat_message->chat_id       = $chat_id;
    $chat_message->save();
    $res['id'] = $chat_message->id;

    http_response(data:$res);

?>