<?php
//
// Allow from any origin
if(isset($_SERVER["HTTP_ORIGIN"])){
    //
    // You can decide if the origin in $_SERVER['HTTP_ORIGIN'] is something you want to 
    //allow, or as we do here, just allow all.
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
else{
    //
    //No HTTP_ORIGIN set, so we allow any. You can disallow if needed here.
    header("Access-Control-Allow-Origin: *");
}
//
header("Access-Control-Allow-Credentials: true");
//
// cache for 10 minutes
header("Access-Control-Max-Age: 600");    
header("Kentionary-Powered-By: HALLELUJAH TECHONOLOGIES INC.");
//
if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
    //
    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"]))
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
    //
    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    // //Just exit with 200 OK with the above headers for OPTIONS method
    // exit(0);
}
//
//Connect to the database;
class config {
    //
    //Properties.
    public $host = "localhost";
    public $user = "root";
    public $password = "";
    public $db_name = "kenny";
    //
    //Use pdo to establish the connection.
    public function connect() {
        //
        //Establish connection to database.
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name;
        $pdo = new PDO($dsn,$this->user,$this->password);
        //
        return $pdo;
    }
}