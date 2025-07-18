<?php

    define('ROOT', __DIR__);

    include(ROOT.'/include/route.php');

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id

?>