<?php

    $token = 'QrtYujorR1Y4gGaxO2CAilCGQzTiLL6tM84Pap5y14vY57v3W5IMKthcCGPEEVmV';
    $req_token = trim(getallheaders()['X-Authorization-Key']);
    if($req_token !== $token) http_response(code:403);

    define(ROOT, __DIR__);

    require_once(ROOT.'/db/meekroDB_3.1.3.php');
    require_once(ROOT.'/db/meekroORM_3.1.3.php');

    DB::$dsn = 'mysql:host=172.31.30.41;dbname=chat';
    DB::$user = 'chat_user';
    DB::$password = 'hJz97Hy4z6Nv';
    DB::addHook('post_run', function($hash) {
        if(isset($hash['error']))
            http_response(code:500, message:$hash['error']);
    });

    if(!file_exists(ROOT.$url['path'].'.php')) exit('file not found');
    $NOW = date('Y-m-d H:i:s');
    include(ROOT.$url['path'].'.php');

?>