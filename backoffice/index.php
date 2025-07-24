<?php

    define('ROOT', __DIR__);

    //check for session, if exist and active go to page, else login
    //when login, return token << token has merchant_id

    // session_start();

	// if (!isset($_SESSION["merchant_id"]) && !isset($_SESSION["token"])) {
    //     //login here,
    //     include(ROOT.'/include/common.php');

    //     parse_request('username', 'password');
	// }

    exit(file_get_contents(ROOT.'/views/init.html'));

?>