<?php

    class Chat extends MeekroORM {

        static function _scopes() {
            return [
                'is_merchant' => fn($merchant_id) => self::where('merchant_id = %i', $merchant_id),
                'is_pinned' => fn() => self::where("pin > 0"),
                'recent' => fn($updated_at) => self::where('updated_at > %s)', $updated_at),
            ];
        }
        
    }

?>