<?php
checkUser('ADMIN');

validateInput(['id' => 'INT']);

DB::update('chat_messages', ['status' => 'DELETED', 'updated_datetime' => $NOW], 'id = %i AND merchant_id = %i', $id, $MERCHANT['id']);

$chat = DB::queryFirstRow("SELECT message, user_id FROM chat_messages WHERE id = %i AND merchant_id = %i AND status = 'DELETED'", $id, $MERCHANT['id']);

if (!empty($chat)) {
    $localDate = localDate('Y-m-d');
    DB::insert('user_action', [
        'merchant_id' 		=> $MERCHANT['id'], 
        'user_id' 			=> $chat['user_id'], 
        'action' 			=> 'MESSAGE DELETED',
        'updated_datetime'	=> $NOW,
        'updated_date'		=> $localDate,
        'updated_by'		=> empty($USER['id']) ? 0 : $USER['id'],
        'description'		=> $chat['message']
    ]);
}

returnAPI('SUCCESS');
?>