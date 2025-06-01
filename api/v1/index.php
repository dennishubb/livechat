<?php
    
    if (empty($merchantId) && !empty($ACCESSIP) && in_array($module,['/chat/whatsappStatus','/chat/receive','/chat/checkMessages','/chat/updateStatus'])) {
        $merchantId = mem('PG8H1kOYyuPO', 300, 'queryFirstField', "SELECT id FROM merchants WHERE whatsapp_server LIKE %ss", '"'.$ACCESSIP.'"');
        $accessByIp = true;
    }

    if (!empty($MERCHANT['domain'])) {
        if (empty($domainId) && $accessByIp && !empty($ACCESSIP)) {
            $domainId = Domain::get($ACCESSIP);
        }
        if (!empty($domainId) && checkInt($domainId)) {
            $DOMAIN = DB::queryFirstRow("SELECT * FROM domain WHERE merchant_id = %i AND id = %i", $MERCHANT['id'], $domainId);
            Domain::overwrite();
        }
    }
    if (empty($DOMAIN)) {
        $DOMAIN = ['id' => 0];
    }

    if ($accessToken === SYSTEMTOKEN || $accessByIp) {
        $USER = ['id' => 0, 'merchant_id' => $MERCHANT['id'], 'type' => 'SYSTEM', 'name' => 'SYSTEM'];
    } else if (!empty($USER['merchant_id']) && $USER['merchant_id'] != $MERCHANT['id']) {
        clientErrorMessage('Invalid Access!');
    }

?>