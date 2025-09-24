<?php
/**
 * Created by PhpStorm.
 * User: saloon
 * Date: 27/04/2020
 * Time: 15:53
 */

class Database {

    private static $db;
    private $connection;

    private function __construct() {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
            $this->connection->set_charset("utf8");
        }
        catch(Exception $e) {
            exit('Could not connect to database');
        }
    }

    function __destruct() {
        $this->connection->close();
    }

    public static function getConnection() {
        if (self::$db == null) {
            self::$db = new Database();
        }
        return self::$db->connection;
    }
}