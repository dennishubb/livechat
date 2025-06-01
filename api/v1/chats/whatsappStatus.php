<?php
checkUser('SYSTEM');

inputParams(['attendingMobile','type']);

$attendingMobile = checkPhone($attendingMobile);

if (empty($attendingMobile)) clientErrorMessage('Invalid Attending Mobile!');

if (empty($type)) {
	$type = 0;
} else {
	$type = 1;
}

$cacheKey = 'GETWANUMBER-'.$MERCHANT['id'];

$numbers = $rediscache1->get($cacheKey);
if (!empty($numbers)) {
	$numbers = json_decode($numbers,true);
}
if (empty($numbers)) {
	$numbers = DB::queryFirstColumn("SELECT mobile FROM whatsapp_status WHERE merchant_id = %i", $MERCHANT['id']);
	$rediscache1->setEx($cacheKey, 600, json_encode($numbers));
}

if (!empty($numbers) && in_array($attendingMobile,$numbers)) {
	DB::update('whatsapp_status', ['updated_datetime' => $NOW, 'domain_id' => $DOMAIN['id'], 'type' => $type, 'status' => 1], 'merchant_id = %i AND mobile = %s', $MERCHANT['id'], $attendingMobile);
} else {
	DB::insert('whatsapp_status', ['merchant_id' => $MERCHANT['id'], 'domain_id' => $DOMAIN['id'], 'mobile' => $attendingMobile, 'type' => $type, 'updated_datetime' => $NOW]);
	$rediscache1->del($cacheKey);
}

returnAPI('SUCCESS');
?>