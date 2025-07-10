<?php
    parse_request(['merchant_id', 'domain_id', 'updated_at', 'type', 'status', 'mobile_only']);

    if(empty($merchant_id)) http_response(code:400);

    if(!empty($merchant_id)) {$where = 'merchant_id = %i_merchant_id'; $query['merchant_id'] = $merchant_id;}
    if(!empty($domain_id)) {$where .= ' AND domain_id = %i_domain_id'; $query['domain_id'] = $domain_id;}
    if(!empty($type) && !empty($status) && !empty($updated_at)) {$where .= ' AND (updated_at >= %s_updated_at OR (type = %s_type AND status = %s_status))'; $query['updated_at'] = date('Y-m-d H:i:s', strtotime('-1 minutes')); $query['type'] = $type; $query['status'] = $status;}
    else{
        if(!empty($type)) {$where .= ' AND type = %i_type'; $query['type'] = $type;}
        if(!empty($status)) {$where .= ' AND status = %i_status'; $query['status'] = $status;}
        if(!empty($updated_at)) {$where .= ' AND updated_at >= %i_updated_at'; $query['updated_at'] = $updated_at;}
    }

    if($mobile_only) $data = DB::queryFirstColumn("SELECT mobile FROM whatsapp WHERE $where", $query);
    else $data = DB::query("SELECT * FROM whatsapp WHERE $where", $query);

    http_response(data:$data);
?>