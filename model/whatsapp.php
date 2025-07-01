<?php

    class Whatsapp extends MeekroORM {

        static $_tablename = 'whatsapp';

        static function _scopes() {
            return [
            ];
        }

        function _validate_status($status) {
            if (!in_array($status, [0,1])) {
                return false;
            }
        }

        function _validate_type($type) {
            if (!in_array($type, [0,1])) {
                return false;
            }
        }
    }

?>