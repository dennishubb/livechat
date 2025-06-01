<?php
checkUser('SYSTEM');

inputParams(['id','status']);

if (!checkInt($id)) clientErrorMessage('Invalid ID!');
if (!in_array($status, ['SKIPPED','SENT'])) clientErrorMessage('Invalid Status!');

DB::update('chat_messages', ['status' => $status, 'updated_datetime' => $NOW], 'id = %i AND merchant_id = %i', $id, $MERCHANT['id']);

returnAPI('SUCCESS');
?>