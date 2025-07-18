<?php

    include(ROOT.'/include/route_parse.php');

    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = explode('/', $url['path']);

    //backoffice.livechat.com/chat/{token} << return merchant chat list
    //backoffice.livechat.com/chat/{token}/message/{chat_id} << return chat messages

    $route = '';
    $parse = match ($path[1]) {
        'chat' => ROOT.'/include/route/chat.php',
        default => route404(),
    };

    $html = file_get_contents(ROOT.'/views/init.html');
    include($parse);

    $html = $html.$parse_html;
    exit($html);

    function route404(){
        include(ROOT.'/views/errors/404.php');
    }

?>