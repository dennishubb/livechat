<?php

    class Messenger extends MeekroORM {

        static $_tablename = 'messenger';

        static function _scopes() {
            return [
            ];
        }

        static function verify_merchant($merchant_id){
            if($this->merchant_id != $merchant_id) http_response(code:403, message:'Invalid merchant');
        }

    }

?>