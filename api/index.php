<?php
    
    //verify api token
    //$token = '';

    if($path[1] !== 'api') exit('error');

    if(!file_exists($url.'.php')) exit('error');

    include($url.'.php');
    
?>