<?php
    
    //verify api token
    //$token = '';

    if($path[0] !== 'api') exit('error');
    if(empty($routes[$path[0]][$path[1]])) exit('error');

    include($routes[$path[0]][$path[1]]);
    
?>