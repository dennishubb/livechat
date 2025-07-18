<?php

    include(ROOT.'/include/route_parse.php');

    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = explode('/', $url['path']);

    //backoffice.livechat.com/chat/{token} << return merchant chat list
    //backoffice.livechat.com/chat/{token}/message/{chat_id} << return chat messages

    $route = '';
    switch($path[1]){
        case 'chat':
            include(ROOT.'/include/route_parse/chat.php');
            break;
        default:
            route404();
            break;
    }

    function route404(){
        include(ROOT.'/views/errors/404.php');
    }

?>