<?php

    class Message extends MeekroORM {
        static function _scopes() {
            return [
            ];
        }

        function _validate_status($status) {
            /**
             * 0 = disabled
             * 1 = active
             * 2 = deleted
             * 3 = skipped
             * 4 = sent
             */
            if (!in_array($status, [0,1,2,3,4])) {
                return false;
            }
        }

        function __isset($property){
            return isset($this->$property);
        }
    }

?>