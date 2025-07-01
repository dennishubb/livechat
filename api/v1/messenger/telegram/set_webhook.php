<?php

    parse_request(['token', 'webhook_url']);

    if(empty($token) || empty($webhook_url)) http_response(code:400, message:"Invalid request");


    $res = custom_curl('https://api.telegram.org/bot'.$token.'/deleteWebhook');
    $res = custom_curl('https://api.telegram.org/bot'.$token.'/setWebhook', ['url' => $webhook_url.'/telegram']);
    $res = json_decode($res,true);
    if (empty($res['ok'])) {
        http_response(code:400);
    }

    http_response();

?>