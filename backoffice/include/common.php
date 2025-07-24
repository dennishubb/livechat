<?php

    function parse_request($params,$striptags = true) {
        foreach ($params as $param) {
            global $$param;
            $tmp = isset($_POST[$param]) ? $_POST[$param] : (isset($_GET[$param]) ? $_GET[$param] : '');
            if(is_array($tmp)) $$param = $tmp;
            else {
                if ($striptags) {
                    $tmp = strip_tags($tmp, '<b><a>');
                }
                $$param = trim($tmp);
            }
        }
    }

    function custom_curl($url,$data = null,$header = false,$timeout = 30,$method = null,$encoding = null,$port = null,$followLocation = false,$returnStatusCode = false, $isUploadFile = false) {
        global $MERCHANT;
        $ch = curl_init();
        if ($header) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false
        ));
        if (!empty($method)) {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        }
        if (!empty($data)) {
            if (is_array($data) && !$isUploadFile) {
                $data = http_build_query($data);
            }
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        if (!empty($encoding)) {
            curl_setopt($ch, CURLOPT_ENCODING, $encoding);
        }
        if (!empty($port)) {
            curl_setopt($ch, CURLOPT_PORT, $port);
        }
        if (!empty($followLocation)) {
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        }
        $res = curl_exec($ch);
        if ($returnStatusCode) {
            $res = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        }
        curl_close($ch);
        return $res;
    }

?>