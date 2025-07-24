<?php
    parse_request(['merchant_id', 'user_id']);

    if(empty($merchant_id) || empty($user_id)) http_response(code:400);

    $unread = DB::query("SELECT chat_id, count FROM unread_messages WHERE merchant_id = %i AND user_id = %i AND count > %i", $merchant_id, $user_id, 0);

    http_response(data:$unread);
?>