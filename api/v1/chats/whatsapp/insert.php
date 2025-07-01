<?php

    parse_request(['merchant_id', 'mobile', 'type', 'domain_id']);

    include(ROOT.'/model/whatsapp.php');

    if(empty($merchant_id) || empty($mobile) || empty($domain_id)) http_response(code:400);

    $whatsapp = new Whatsapp();
    $whatsapp->merchant_id = $merchant_id;
    $whatsapp->mobile      = $mobile;
    $whatsapp->domain_id   = $domain_id;
    $whatsapp->type        = empty($type) ? 0 : 1;
    $whatsapp->updated_at  = $NOW;
    $whatsapp->save();

    http_response();

?>