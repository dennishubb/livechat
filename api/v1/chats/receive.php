<?php
checkUser('SYSTEM');

inputParams(['messages','attendingMobile','updateWhatsappStatusType']);

$attendingMobile = checkPhone($attendingMobile);

if (empty($attendingMobile)) clientErrorMessage('Invalid Attending Mobile!');

if (empty($MERCHANT['live'])) returnAPI('SUCCESS');

if (bmids($MERCHANT['id'],30)) {
	returnAPI('SUCCESS');
}

$messages = json_decode($messages,true);

if (empty($messages)) returnAPI('SUCCESS');

foreach ($messages as $i => $m) {
	$mobile = checkPhone($m['author'],true);
	if (empty($mobile)) {
		continue;
	}
	if (strpos($m['body'], 'data:') !== false) {
		$body = s3Upload($m['body']);
	} else {
		$body = $m['body'];
	}
	$user = DB::queryFirstRow("SELECT * FROM users WHERE merchant_id = %i AND domain_id = %i AND type = 'PUBLIC' AND mobile = %s", $MERCHANT['id'], $DOMAIN['id'], $mobile);
	if (empty($user)) {
		$referrerId = DB::queryFirstField("SELECT id FROM users WHERE merchant_id = %i AND type = 'ADMIN' AND admin_mobile = %s", $MERCHANT['id'], $attendingMobile);
		if (empty($referrerId)) {
			$referrerId = PU::getReferrer($body,'id');
		}
		$user = PU::create($mobile, $m['senderName'], $referrerId, $attendingMobile);
		$autoreply = ['user' => $user, 'register' => 1];
	} else {
		if ($user['status'] === 'INACTIVE') {
			continue;
		}
		if ($user['attending_mobile'] != $attendingMobile) {
			$user['attending_mobile'] = $attendingMobile;
			PU::update($user['id'], ['attending_mobile' => $attendingMobile]);
		}
		$autoreply = ['user' => $user, 'body' => $body];
	}
	Chat::insert(['merchant_id' => $MERCHANT['id'], 'user_id' => $user['id'], 'message' => $body, 'source' => 'WHATSAPP'], $autoreply);
}

if (!empty($updateWhatsappStatusType)) {
	$keys = $redisstat->keys("WHATSAPPTYPE1-$attendingMobile-*");
	if (!empty($keys)) {
		$redisstat->del($keys);
	}
	selfAPI($MERCHANT['id'], '/chat/whatsappStatus', ['domainId' => $DOMAIN['id'], 'attendingMobile' => $attendingMobile, 'type' => 1]);
}

returnAPI('SUCCESS');
?>