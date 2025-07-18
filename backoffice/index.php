<?php

    define('ROOT', __DIR__);

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id
    
    include(ROOT.'/include/route.php');

?>