<?php
checkUser('ADMIN');

inputParams(['mobile']);

$domainId = 0;

if (strpos($mobile,'/') !== false) {
	$tmp = explode('/', $mobile);
	$mobile = $tmp[0];
	$domainId = $tmp[1];
}

$mobile = checkPhone($mobile,true);

if (empty($mobile)) clientErrorMessage('Invalid Mobile.');

if (!checkInt($domainId)) clientErrorMessage('Invalid Domain ID.');

$user = DB::queryFirstRow("SELECT * FROM users WHERE merchant_id = %i AND domain_id = %i AND type = 'PUBLIC' AND mobile = %s", $MERCHANT['id'], $domainId, $mobile);

if (empty($user)) {
	$user = PU::create($mobile, null, null, null, $domainId);
}

$password = rand(100000,999999);

PU::update($user['id'], ['password' => $password, 'setting' => ['changePassword' => 1]]);

$res = sendSMS($mobile, "User: $mobile Pass: $password", 1);
if (empty($res['success'])) {
	$err = !empty($res['response']) ? $res['response'] : 'Sending SMS failed. Please contact us for help.';
	clientErrorMessage($err);
}

returnAPI('SUCCESS');
?>