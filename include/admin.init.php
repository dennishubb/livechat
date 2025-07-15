<?php

    define('ADMIN_VERSION', '1');

    $html = file_get_contents(ROOT.'/admin/init.html');
    $html = str_replace('{Version}', ADMIN_VERSION, $html);

    exit($html);
?>