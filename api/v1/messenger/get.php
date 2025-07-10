<?php

    parse_request(['field', 'sender_id', 'user_id', 'type', 'merchant_id']);

    if(empty($merchant_id) || empty($type)) http_response(code:400, message:"Invalid request");

    $where = 'merchant_id = %i_merchant_id';
    $params['merchant_id'] = $merchant_id;
    
    if(!empty($user_id)){
        if(is_array($user_id)){
            $where .= ' AND user_id IN %li_user_id';
            $params['user_id'] = $user_id;
        }else{
            $where .= ' AND user_id IN %li_user_id';
            $params['user_id'] = $user_id; 
        }
    }

    if(!empty($sender_id)){
        $where .= ' AND sender_id IN %li_sender_id';
        $params['sender_id'] = $sender_id; 
    }

    if(is_array($type)){
        $where .= ' AND type IN %ls_type';
        $params['type'] = $type;
    }else{
        $where .= ' AND type = %s_type';
        $params['type'] = $type;
    }

    if(empty($field)) $select = '*';
    else $select = implode(',', $field);
    
    if(!empty($field) && count($field)  === 1){
        $res = DB::queryFirstColumn("SELECT $select FROM messenger WHERE $where", $params);
        if(!empty($res) && count($res) === 1) $res = $res[0];
    }else{
        $res = DB::query("SELECT $select FROM messenger WHERE $where", $params);
    }

    http_response(data:$res);

?>