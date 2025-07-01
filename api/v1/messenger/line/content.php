<?php

    parse_request(['token', 'message_id']);

    if(empty($token) || empty($message_id)) http_response(code:400, message:"Invalid request");

    $header = ['Content-Type: application/json','Authorization: Bearer '.$token];
    $res = customCurl('https://api-data.line.me/v2/bot/message/'.$message_id.'/content', null, $header);
    if (!empty($res)) {
        http_response(data:$res);
    }
    http_response(code:400);


?>