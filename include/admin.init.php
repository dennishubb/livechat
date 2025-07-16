<?php

    define('ADMIN_VERSION', '1');

    // $html = file_get_contents(ROOT.'/admin/init.html');
    // $html = str_replace('{Version}', ADMIN_VERSION, $html);

    // exit($html);

    if(!file_exists(ROOT.$url['path'].'.html')) exit('file not found');
    $NOW = date('Y-m-d H:i:s');
    include(ROOT.$url['path'].'.html');
?>