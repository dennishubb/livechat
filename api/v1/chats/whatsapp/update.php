<?php

    parse_request(['mobile', 'status', 'batch']);

    if(empty($mobile)) http_response(code:400, message:'invalid mobile');

    if($batch){
        if(!is_array($mobile)) http_response(code:400, message:'invalid mobile');
        DB::query("UPDATE whatsapp_status SET status = %s WHERE mobile IN %li", $status, $mobile);
    }else{
        include(ROOT.'/model/whatsapp.php');

        $whatsapp = Whatsapp::Search(['mobile' => $mobile]);
        if(!$whatsapp->has('id')) http_response(code:404);
    
        $whatsapp->status      = $status;
        $whatsapp->updated_at  = $NOW;
        $whatsapp->save();
    }

    http_response();

?>