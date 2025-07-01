<?php

    parse_request(['sender_id', 'token']);

    $header = ['Content-Type: application/json','Authorization: Bearer '.$token];
    $res = custom_curl('https://api.line.me/v2/bot/profile/'.$senderId, null, $header);
    $res = json_decode($res,true);
    if (!empty($res['displayName'])) {
        http_response(code:200, data:$res);
    }else{
        http_response(code:400);
    }

?>