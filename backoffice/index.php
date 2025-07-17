<?php

    if($_REQUEST['REQUEST_METHOD'] !== 'GET') exit('invalid request');

    define(ROOT, __DIR__);

    include(ROOT.'/include/route.php');

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id

?>