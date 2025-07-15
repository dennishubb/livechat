<?php

    define('ADMIN_VERSION', '1');

    $html = file_get_contents(ROOT.'/admin/init.html');
    $html = str_replace('{Version}', ADMIN_VERSION, $html);
    $html = str_replace('{Root}', ROOT, $html);

    exit($html);
?>