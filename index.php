<?php

    require_once(__DIR__.'/include/init.php');
    require_once(__DIR__.'/include/common.php');
    require_once(__DIR__.'/include/routes.php');

    define('ROOT', __DIR__);

    if($path[0] === 'api') require_once(__DIR__.'/api/index.php'); //include api
    else if($path[0] === 'public') echo "public"; //include public

?>