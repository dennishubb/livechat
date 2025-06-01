<?php

    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = explode('/', $url['path']);

    $routes['api']['v1'] = array(
        'chats/get' => 'chats/get.php',
        'chats/messages/checkMessages',
        'chats/messages/delete/{message_id}',
        'chats/messages/get/{user_id}',
        'chats/messages/update/{message_id}',
    );

?>