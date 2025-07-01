<?php

    parse_request(['user_id', 'token', 'text']);

    if(empty($user_id) || empty($token) || empty($text)) http_response(code:400, message:"invalid request");

    $senderId = null;
    $replyToken = null;
    $mdt = date('Y-m-d H:i:s', strtotime('-25 second'));
    $res = DB::query("SELECT type, sender_id, updated_at FROM messenger WHERE user_id = %i AND type IN %ls", $user_id, ['LINE','LINEREPLY']);
    foreach ($res as $r) {
        if ($r['type'] === 'LINE') {
            $senderId = $r['sender_id'];
        } else if ($r['type'] === 'LINEREPLY' && $r['updated_at'] > $mdt) {
            $replyToken = $r['sender_id'];
        }
    }
    if (!empty($replyToken)) {
        $header = ['Content-Type: application/json','Authorization: Bearer '.$token];
        $data = ['replyToken' => $replyToken, 'messages' => [['type' => 'text', 'text' => $text]]];
        $res = custom_curl('https://api.line.me/v2/bot/message/reply', json_encode($data), $header);
        if ($res === '{}') {
            DB::update('messenger', ['updated_at' => $mdt], 'user_id = %i AND type = %s', $user_id, 'LINEREPLY');
            http_response(message:"LINE REPLY SENT");
        }
    } else if (!empty($senderId)) {
        $header = ['Content-Type: application/json','Authorization: Bearer '.$token];
        $data = ['to' => [$senderId], 'messages' => [['type' => 'text', 'text' => $text]]];
        $res = custom_curl('https://api.line.me/v2/bot/message/multicast', json_encode($data), $header);
        if ($res === '{}') {
            http_response(message:"LINE SENT");
        }
    }

    http_response(code:400);

?>