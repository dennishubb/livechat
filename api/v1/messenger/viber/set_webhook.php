<?php

    parse_request(['webhook_url', 'token']);

    if(empty($webhook_url) || empty($token)) http_response(code:400);

    $header = ['X-Viber-Auth-Token: '.$token];
    $data = json_encode(['url' => $webhook_url.'/viber', 'send_name' => true, 'send_photo' => true]);
    custom_curl(url:'https://chatapi.viber.com/pa/set_webhook', data:$data, header:$header);

    http_response();

?>