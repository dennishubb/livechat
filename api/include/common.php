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

    function validateFile($file,$size) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo,$file);
        $extension = mineToExtension($mime);
        if (empty($extension)) {
            return 'Only png / jpg / gif / pdf file is allowed.'.(empty($mime) ? '' : ' ['.$mime.']');
        }
        if (filesize($file)/1048576 > $size) {
            return 'Your uploaded file size is too big. (Max. '.$size.'MB)';
        }
        return ['mine' => $mime, 'extension' => $extension];
    }
    function processUploadedFile($file,$size,$compress = true, $purpose = false) {
        $file = $file['tmp_name'];
        $prop = validateFile($file,$size);
        if (!empty($prop['mine'])) {
            $mime = $prop['mine'];
        } else if (is_string($prop)) {
            http_response(code:400, message:$prop);
        }
        $fileURL = s3Upload($file,$mime,$compress);
        $fileId = 0;
        if (!empty($MERCHANT) && !empty($fileURL) && !empty($purpose)) {
            DB::insert('file_upload', ['merchant_id' => $MERCHANT['id'], 'url' => $fileURL, 'purpose' => $purpose]);
            $fileId = DB::insertId();
        }
        return ['fileId' => $fileId, 'fileURL' => $fileURL, 'mine' => $mime];
    }
    function s3Upload($file, $mime = null, $compress = true) {
        $option = ['Bucket' => S3BUCKET];
        $s3Client = new \Aws\S3\S3Client([
            'version' => 'latest',
            'region' => S3REGION,
            'credentials' => ['key' => S3KEY, 'secret' => S3SECRET]
        ]);
        if (empty($mime)) {
            $tmp = explode(',', $file);
            $fileContent = base64_decode(end($tmp));
            $tmp = explode(':', explode(';', $tmp[0])[0]);
            $mime = end($tmp);
            $extension = mineToExtension($mime);
            $tempPath = sys_get_temp_dir() . '/' . uniqid('image_', true) . '.' . $extension;
            file_put_contents($tempPath, $fileContent);
            $file = $tempPath; // Update file to temp path for Intervention Image
        } else {
            $extension = mineToExtension($mime);
        }
        if (empty($extension)) {
            return false;
        }
        $fileName = strrev(uniqid()) . generateSecureToken(8) . '.' . $extension;
        if ($compress && in_array($extension, ['png', 'jpg', 'jpeg'])) {
            // Initialize Intervention Image Manager
            $manager = new \Intervention\Image\ImageManager();
            $image = $manager->make($file);
            // Check if the image width is more than 1500px
            if ($image->width() > 1500) {
                // Resize the image to 1500px width while maintaining aspect ratio
                $image->resize(1500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }
            if (in_array($extension, ['jpg','jpeg'])) {
                // For JPEG, apply lossy compression by adjusting quality
                $image->encode('jpg', 30);
                $compressedPath = sys_get_temp_dir() . '/' . uniqid('compressed_', true) . '.' . $extension;
                $image->save($compressedPath);
                $file = $compressedPath;
            } else if ($extension === 'png') {
                // Save the original image temporarily for pngquant processing
                $compressedPath = sys_get_temp_dir() . '/' . uniqid('compressed_', true) . '.' . $extension;
                $image->save($compressedPath);
                // Compress PNG using pngquant
                $command = ['pngquant', '--force', '--output', $compressedPath, '--quality=70', $compressedPath];
                $process = new Symfony\Component\Process\Process($command);
                $process->run();
                if (!$process->isSuccessful()) {
                    logLine("IMAGE", "pngquant compression failed : " . $process->getErrorOutput());
                    // Optionally, continue using the original image if pngquant fails
                } else {
                    // Update file path to the compressed image
                    $file = $compressedPath;
                }
            }
        }
        $option['SourceFile'] = $file;
        $option['Key'] = S3MEDIAPATH . '/' . $fileName;
        $option['ContentType'] = $mime;
        // Upload the image to S3
        $s3Client->putObject($option);
        $url = 'https://' . GLOBALSTATICDOMAIN . '/' . S3MEDIAPATH . '/' . $fileName;
        // Clean up temporary files
        if (isset($tempPath) && file_exists($tempPath)) {
            unlink($tempPath);
        }
        if (isset($compressedPath) && file_exists($compressedPath)) {
            unlink($compressedPath);
        }
        return $url;
    }

?>