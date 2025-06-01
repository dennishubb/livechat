<?php
checkUser('ADMIN');

validateInput([
	'userId' => ['type' => 'INT'],
	'setPin' => ['type' => 'INT', 'optional' => 1]
]);

$count = DB::queryFirstField("SELECT COUNT(*) FROM users WHERE id = %i AND merchant_id = %i", $userId, $MERCHANT['id']);
if (empty($count)) clientErrorMessage('Invalid User.');

$cachekey = 'PINCHAT-'.$MERCHANT['id'];
$pinchat = 0;

if (isset($_POST['setPin'])) {
	if (empty($setPin)) {
		$redischat->sRem($cachekey, $userId);
	} else {
		$redischat->sAdd($cachekey, $userId);
		$pinchat = $setPin;
	}
} else {
	if ($redischat->sIsMember($cachekey, $userId)) {
		$redischat->sRem($cachekey, $userId);
	} else {
		$redischat->sAdd($cachekey, $userId);
		$pinchat = 1;
	}
}

$redischat->setEx('PINCHATDATETIME-'.$MERCHANT['id'], 86400, $NOW);

PU::update($userId, ['setting' => ['pinchat' => $pinchat]]);

returnAPI('SUCCESS');
?>