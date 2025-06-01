<?php

    $url = parse_url($_SERVER['REQUEST_URI']);

    $routes['api']['v1'] = array(
        'chats/get',
        'chats/messages/checkMessages',
        'chats/messages/delete/{message_id}',
        'chats/messages/get/{user_id}',
        'chats/messages/update/{message_id}',
    );

?>