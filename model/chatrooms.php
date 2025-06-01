<?php

    class chats extends dbObject {
        protected $relations = Array(
            'chats'  	=> Array('hasMany', 'chats', 'id'),
        );
        
        protected $dbFields = array(
            'id'            => array('int'),
            'merchant_id'   => array('int'),
            'user_id'   	=> array('int'),
            'chatroom_name' => array('string'),
            'status' 		=> array('int'), //tinyint 1 = ACTIVE, 2 = CLOSED, 3 = DELETED
            'pin'           => array('int'),
            'created_at'    => array('datetime'),
            'updated_at'    => array('datetime')
        );
		
		protected $privacySetting = 1;
		
    }

?>