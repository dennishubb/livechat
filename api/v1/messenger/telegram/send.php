<?php

    parse_request(['user_id', 'token', 'text']);

    if(empty($user_id) || empty($token) || empty($text)) http_response(code:400, message:"Invalid request");

    $senderId = DB::queryFirstField("SELECT sender_id FROM messenger WHERE user_id = %i AND type = %s", $user_id, 'TELEGRAM');
    if (!empty($senderId)) {
        $extension = substr($text,-4);
        if (strpos($text,'https://') === 0 && in_array($extension,['.png','.jpg','.gif'])) {
            $res = custom_curl('https://api.telegram.org/bot'.$token.'/sendPhoto', ['chat_id' => $senderId, 'photo' => $text]);
        } else if (strpos($text,'https://') === 0 && $extension === '.pdf') {
            $res = custom_curl('https://api.telegram.org/bot'.$token.'/sendDocument', ['chat_id' => $senderId, 'document' => $text]);
        } else if (strpos($text,'https://') === 0 && $extension === '.ogg') {
            $res = custom_curl('https://api.telegram.org/bot'.$token.'/sendVoice', ['chat_id' => $senderId, 'voice' => $text]);
        } else {
            $res = custom_curl('https://api.telegram.org/bot'.$token.'/sendMessage', ['chat_id' => $senderId, 'text' => $text]);
        }
        if (!empty($res)) {
            $res = json_decode($res,true);
            if (!empty($res['ok'])) {
                http_response();
            }
        }
    }
    http_response(code:400);

?>