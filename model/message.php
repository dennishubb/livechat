<?php

    class Message extends MeekroORM {
        static function _scopes() {
            return [
            ];
        }

        function _validate_status($status) {
            if (!in_array($status, [0,1,2,3,4])) {
                return false;
            }
        }
    }

?>