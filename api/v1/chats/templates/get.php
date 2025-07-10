<?php

	parse_request(['merchant_id', 'domain_id', 'status']);

	if (empty($merchant_id)) http_response(code:400, message:'invalid merchant');

    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i AND status = %i", 0, 0, 1);
    $defaults = array();
    $defaults_id = array();
    foreach($res as $data){
        $defaults[$data['type']] = $data['message'];
        $defaults_id[$data['type']] = $data['id'];
    }

    $res = DB::query("SELECT id, type, message FROM templates WHERE merchant_id = %i AND domain_id = %i".(empty($status) ? '' : " AND status = $status"), $merchant_id, $domain_id);
    $templates = array();
    $templates_id = array();
    foreach($res as $data){
        $templates[$data['type']] = $data['message'];
        $templates_id[$data['type']] = $data['id'];
    }

    $diff = array_diff_key($defaults, $templates);
    print_r($diff);
    if(count($diff) > 0){
        foreach($diff as $key => $value){
            $templates[$key] = $value;
            $templates_id[$key] = $defaults_id[$key];
        }
    }

    $resp['templates'] = $templates;
    $resp['templates_id'] = $templates_id;

	http_response(data:$resp);

?>