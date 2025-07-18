<?php

    define('ROOT', __DIR__);

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id

    $main_html = file_get_contents(ROOT.'/views/main/main.html');

    include(ROOT.'/include/route.php');

?>