<?php

    parse_request(['whatsapp_id', 'merchant_id']);

    include(ROOT.'/model/whatsapp.php');

    $whatsapp = new Whatsapp();
    $whatsapp::Load($whatsapp_id);

    if(!$whatsapp->has('id')) http_response(code:404);
    if($whatsapp->merchant_id != $merchant_id) http_response(code:403);

    $whatsapp->destroy();

    http_response();

?>