<?php

    require_once(__DIR__.'/include/common.php');
    require_once(__DIR__.'/include/routes.php');

    define('ROOT', __DIR__);

    if($path[1] === 'api') require_once(__DIR__.'/include/api.init.php');
    if(!file_exists(ROOT.$url['path'].'.php')) exit('file not found');

    $NOW = date('Y-m-d H:i:s');

    include(ROOT.$url['path'].'.php');
    
?>