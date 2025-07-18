<?php

    $main_html = str_replace('<!--CUSTOM_CSS-->', '<link rel="stylesheet" type="text/css" href="/views/chat/chats.css">', $main_html);
    $main_html = str_replace('<!--CUSTOM_JS-->', '<script type="text/javascript" src="/views/chat/chats.js"></script>', $main_html);

    exit($main_html);

?>