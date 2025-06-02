<?php
    
    //verify api token
    //$token = '';

    require_once(ROOT.'/include/meekroDB_3.1.3.php');
    require_once(ROOT.'/include/meekroORM_3.1.3.php');

    DB::$dsn = 'mysql:host=172.31.30.41;dbname=chat';
    DB::$user = 'chat_user';
    DB::$password = 'hJz97Hy4z6Nv';
    
?>