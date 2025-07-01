<?php

    parse_request(['user_id', 'token', 'name', 'text']);

    if(empty($user_id) || empty($token) || empty($text) || empty($name)) http_response(code:400, message:"invalid parameters");

    $senderId = DB::queryFirstField("SELECT sender_id FROM user_messenger WHERE user_id = %i AND type = %s", $user_id, 'VIBER');
    if (!empty($senderId)) {
        $header = ['X-Viber-Auth-Token: '.$token];
        $data = json_encode(['receiver' => $senderId, 'sender' => ['name' => $name], 'type' => 'text', 'text' => $text]);
        custom_curl(url:'https://chatapi.viber.com/pa/send_message', data:$data, header:$header);
    }

    http_response();

?>