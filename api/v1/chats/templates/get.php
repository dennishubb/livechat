<?php

	parse_request(['merchant_id', 'domain_id', 'status']);

	if (empty($merchant_id)) http_response(code:400, message:'invalid merchant');

    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i AND status = %i", 0, 0, 1);
    $defaults = array();
    foreach($res as $data){
        $defaults[$data['type']] = $data['message'];
    }

    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i".(empty($status) ? '' : " AND status = $status"), $merchant_id, $domain_id);
    $templates = array();
    foreach($res as $data){
        $templates[$data['type']] = $data['message'];
    }

    $diff = array_diff_key($defaults, $templates);
    if(count($diff) > 0){
        foreach($diff as $key){
            $templates[$key] = $defaults[$key];
        }
    }

	http_response(data:$templates);

?>