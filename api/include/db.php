<?php

    require_once(ROOT.'/db/meekroDB_3.1.3.php');
    require_once(ROOT.'/db/meekroORM_3.1.3.php');

    DB::$dsn = 'mysql:host=172.31.30.41;dbname=chat';
    DB::$user = 'chat_user';
    DB::$password = 'hJz97Hy4z6Nv';
    DB::addHook('post_run', function($hash) {
        if(isset($hash['error']))
            http_response(code:500, message:$hash['error']);
    });

?>