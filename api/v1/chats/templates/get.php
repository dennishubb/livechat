<?php

	parse_request(['merchant_id', 'user_id', 'status']);

	if (empty($merchant_id)) http_response(code:400, message:'invalid merchant');

    $domain_id = 0;
    if (!empty($user_id)){
        $domain_id = DB::queryFirstField("SELECT domain_id FROM users WHERE user_id = %i", $user_id);
    }

    //get defaults
    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i AND status = %i", 0, 0, 1);
    $defaults = array();
    $defaults_id = array();
    foreach($res as $data){
        $defaults[$data['type']] = $data;
    }

    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i".(empty($status) ? '' : " AND status = $status"), $merchant_id, $domain_id);
    $templates = array();
    foreach($res as $data){
        $templates[$data['type']] = $data;
    }

    $diff = array_diff_key($defaults, $templates);
    if(count($diff) > 0){
        foreach($diff as $key => $value){
            $templates[$key] = $value;
        }
    }

    $resp['templates'] = $templates;

	http_response(data:$resp);

?>