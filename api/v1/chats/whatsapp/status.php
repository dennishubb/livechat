<?php

parse_request(['mobile', 'type', 'domain_id', 'merchant_id']);

if (empty($mobile)) http_response(code:400, message:'Invalid Mobile');
if (empty($merchant_id)) http_response(code:400, message:'Invalid merchant');
if (empty($domain_id)) $domain_id = 0;

require_once(ROOT.'/model/whatsapp.php');

$whatsapp = Whatsapp::Search(['merchant_id' => $merchant_id, 'mobile' => $mobile]);
if($whatsapp === null){
    $whatsapp = new Whatsapp();
    $whatsapp->merchant_id  = $merchant_id;
    $whatsapp->domain_id    = $domain_id;
    $whatsapp->mobile       = $mobile;
    $whatsapp->type         = $type;
    $whatsapp->save();
}else{
    $whatsapp->updated_at   = $NOW;
    $whatsapp->domain_id    = $domain_id;
    $whatsapp->type         = $type;
    $whatsapp->status       = 1;
    $whatsapp->save();
}

http_response();
?>