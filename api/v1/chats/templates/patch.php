<?php

    parse_request(['merchant_id', 'domain_id', 'templates']);

    if(empty($merchant_id) || empty($templates)) http_response(code:400);
    if(strlen($domain_id) === 0) http_response(code:400);

    include(ROOT.'/model/template.php');

    $templates = json_decode($templates, true);

    if($templates === null) http_response(code:400, message:"invalid json format");

    foreach($templates as $key => $value){
        $template = Template::Search(['merchant_id' => $merchant_id, 'domain_id' => $domain_id, 'type' => $key]);
        if($template === null){
            $template = new Template();
            $template->merchant_id = $merchant_id;
            $template->domain_id = $domain_id;
            $template->type = $key;
            $template->message = $value;
            $template->save();
        }else{
            $template->message = $value;
            $template->save();
        }
    }

    http_response();

?>