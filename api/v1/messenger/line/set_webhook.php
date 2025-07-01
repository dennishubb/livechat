<?php

    parse_request(['webhook_url', 'token']);

    if(empty($webhook_url) || empty($token)) http_response(code:400, message:"invalid request");

    $header = ['Content-Type: application/json','Authorization: Bearer '.$token];
    $data = ['endpoint' => $webhook_url.'/line'];
    $res = custom_curl('https://api.line.me/v2/bot/channel/webhook/endpoint', json_encode($data), $header, 30, 'PUT');
    if ($res === '{}') {
        http_response();
    }
    http_response(code:400);

?>