<?php

    define('ROOT', __DIR__);

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id

    exit(file_get_contents(ROOT.'/views/init.html'));
    
    // include(ROOT.'/include/route.php');

?>