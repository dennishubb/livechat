<?php

    parse_request(['merchant_id', 'domain_id', 'templates']);

    if(empty($merchant_id) || empty($domain_id) || empty($templates)) http_response(code:400);

    include(ROOT.'/model/template.php');

    $templates = json_decode($templates, true);

    foreach($templates as $key => $value){
        $template = Template::Search(['merchant_id' => $merchant_id, 'domain_id' => $domain_id, 'type' => $key]);
        if(!empty($template)){
            $template->message = $value;
            $template->save();
        }else{
            $template = new Template();
            $template->merchant_id = $merchant_id;
            $template->domain_id = $domain_id;
            $template->type = $type;
            $template->message = $value;
            $template->save();
        }
    }

    http_response();

?>