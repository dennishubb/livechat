<?php

    parse_request('merchant_id', 'user_id', 'sender_id', 'type');

    if(empty($merchant_id) || empty($user_id) || empty($sender_id) || empty($type)) http_response(code:400, message:'invalid request');

    include(ROOT.'/model/messenger.php');

    $messenger = Messenger::Search("SELECT id FROM messenger WHERE merchant_id = %i AND type = %s AND (user_id = %i OR sender_id = %s) LIMIT 1", $merchant_id, $type, $user_id, $sender_id);

    $message = '';
    if($messenger === null){
        $messenger = new Messenger();
        $messenger->merchant_id = $merchant_id;
        $messenger->user_id = $user_id;
        $messenger->sender_id = $sender_id;
        $messenger->type = $type;
        $messenger->save();
        $message = "INSERTED";
    }else{
        $messenger->user_id = $user_id;
        $messenger->sender_id = $sender_id;
        $messenger->save();
        $message = "UPDATED";
    }

    http_response(message:$message);

?>