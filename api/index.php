<?php

    header('Access-Control-Allow-Origin: http://backoffice.livechat.com');

    $token = 'QrtYujorR1Y4gGaxO2CAilCGQzTiLL6tM84Pap5y14vY57v3W5IMKthcCGPEEVmV';
    $req_token = trim(getallheaders()['X-Authorization-Key']);
    if($req_token !== $token) http_response(code:403);

    define('ROOT', __DIR__);

    require_once(ROOT.'/include/db.php');
    require_once(ROOT.'/include/common.php');
    require_once(ROOT.'/include/routes.php');

    if(!file_exists(ROOT.$url['path'].'.php')) exit('file not found');
    $NOW = date('Y-m-d H:i:s');
    include(ROOT.$url['path'].'.php');

?>