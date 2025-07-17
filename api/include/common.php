<?php

    function captchaValidate() {
        // if (checkAccessIP(SUPPORTIP)) {
        //     return true;
        // }
        $captchaOutput = '';
        if (!empty($_REQUEST['captchaOutput'])) {
            $captchaOutput = $_REQUEST['captchaOutput'];
        } else if (!empty($_REQUEST['captchaToken'])) {
            $captchaOutput = $_REQUEST['captchaToken'];
        }
        if (!empty($captchaOutput)) {
            $sceneId = jsonValue($captchaOutput,'sceneId');
            if (!empty($sceneId)) {
                AlibabaCloud::accessKeyClient(ALIYUNCAPTCHAACCESSKEYID,ALIYUNCAPTCHAACCESSKEYSECRET)->regionId('ap-southeast-1')->asDefaultClient()->options([]);
                $query = ['CaptchaVerifyParam' => $captchaOutput, 'SceneId' => $sceneId];
                $res = AlibabaCloud::rpc()->product('captcha')->version('2023-03-05')->action('VerifyIntelligentCaptcha')->method('POST')->host('captcha.ap-southeast-1.aliyuncs.com')->options(['query' => $query])->request();
                if (!empty($res['Result']['VerifyResult']) && !empty($res['Result']['VerifyCode']) && $res['Result']['VerifyCode'] === 'T001') {
                    return true;
                }
            }
        }
        return false;
    }

    function checkLength($string,$min,$max,$alnum = false) {
        if ($alnum && !ctype_alnum(str_replace(' ','',$string))) return false;
        if (mb_strlen($string, 'UTF-8') > $max || mb_strlen(trim($string), 'UTF-8') < $min) return false;
        return true;
    }
    function checkInt($num) {
        if (ctype_digit($num) || is_int($num))
            return true;
        return false;
    }

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

    function validateInput($params) {
        foreach ($params as $param => $validation) {
            global $$param;
            if (isset($_POST[$param]) || isset($_GET[$param])) {
                $$param = trim(strip_tags(isset($_POST[$param]) ? $_POST[$param] : (isset($_GET[$param]) ? $_GET[$param] : ''), '<b><a>'));
            } else {
                $$param = null;
            }
            $invalid = false;
            if (is_string($validation)) {
                $validation = ['type' => $validation];
            }
            if (count(array_filter(array_keys($validation),'is_string')) === 0) {
                $validation = ['set' => $validation];
            }
            if (isset($validation['type'])) {
                if ($validation['type'] === 'INT') {
                    if (!checkInt($$param)) $invalid = true;
                } else if ($validation['type'] === 'FLOAT') {
                    if (!is_numeric($$param)) $invalid = true;
                }
            }
            if (isset($validation['set'])) {
                $tmp = json_decode($$param,true);
                if (is_array($tmp)) {
                    if (array_intersect($tmp, $validation['set']) == $tmp) {
                        $$param = $tmp;
                    } else {
                        $invalid = true;
                    }
                } else {
                    if (!in_array($$param,$validation['set'])) $invalid = true;
                }
            }
            if (isset($validation['min'])) {
                if (mb_strlen($$param, 'UTF-8') < $validation['min']) $invalid = true;
            }
            if (isset($validation['max'])) {
                if (mb_strlen($$param, 'UTF-8') > $validation['max']) $invalid = true;
            }
            if ($invalid) {
                if (empty($$param) && !empty($validation['optional'])) {
                    continue;
                }
                $a = [];
                $b = preg_split('/(?=[A-Z])/',$param);
                foreach ($b as $c) {
                    if (!empty($c)) {
                        if (strtolower($c) === 'id') {
                            array_push($a,strtoupper($c));
                        } else {
                            array_push($a,ucfirst($c));
                        }
                    }
                }
                clientErrorMessage('Invalid '.implode(' ',$a).'.');
            }
        }
    }

    function http_response($code = 200, $message = '', $data = array()){
        if(!$message){
            $message = match($code){
                200 => 'Success',
                400 => 'Error',
                403 => 'Forbidden',
                404 => 'Not Found',
                500 => 'Internal error',
                default => 'Invalid'
            };
        }

        http_response_code($code);

        exit(json_encode(['status' => $code, 'message' => $message, 'data' => $data, 'timestamp' => date('c')]));
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