<?php

    parse_request(['token', 'user_id', 'channel']);

    if(empty($token) || empty($user_id) || empty($channel)) http_response(code:400, message:'invalid request');

    //verify member
    $senderId = DB::queryFirstField("SELECT sender_id FROM messenger WHERE user_id = %i AND type = %s", $user_id, 'TELEGRAM');
    if (!empty($senderId)) {
        $res = custom_curl('https://api.telegram.org/bot'.$token.'/getChatMember', ['chat_id' => '@'.$channel, 'user_id' => $senderId]);
        if (!empty($res)) {
            $res = json_decode($res,true);
            if (!empty($res['result']['status']) && $res['result']['status'] === 'member') {
                http_response(message:"MEMBER");
            }
        }
    }

    http_response(message:"NOT MEMBER");

?>