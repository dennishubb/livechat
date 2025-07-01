<?php

    parse_request(['update_data', 'user_id', 'type', 'sender_id', 'messenger_id', 'merchant_id']);

    if(empty($update_data) || empty($where) || empty($merchant_id)) http_response(code:400, message:"Invalid request");
    if(!is_array($update_data)) http_response(code:400, message:"invalid request");

    $updatable_columns = array('user_id', 'sender_id', 'updated_at');
    $to_update_keys = array_keys($update_data);

    if(empty($to_update_keys)) http_response(code:400, message:"invalid request");
    if(!in_array($to_update_keys, $updatable_columns)) http_response(code:400, message:"invalid request");

    include(ROOT.'/model/messenger.php');

    $search = array();
    if(!empty($messenger_id)) $search['id'] = $messenger_id;
    else{
        if(!empty($user_id)) $search['user_id'] = $user_id;
        if(!empty($type)) $search['type'] = $type;
        if(!empty($sender_id)) $search['sender_id'] = $sender_id;
    }

    $messenger = Messenger::Search($search);
    if(!isset($messenger->id)) http_response(code:404, message:"record not found");
    if($messenger->merchant_id != $merchant_id) http_response(code:403, message:"invalid merchant");

    foreach($update_data as $key => $value){
        $messenger->$key = $value;
    }

    $messenger->save();

    http_response();

?>