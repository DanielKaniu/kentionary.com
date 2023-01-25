<?php
//
include_once '../config.php';
//
//Get the data on the request body;
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['values'];
//
//The details.
$email = $word['email'];
$message = $word['message'];
$subject = $word['subject'];
//
//Save the inquiry details in the database.
function save_message($email, $message, $subject){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "INSERT INTO contact(email, message, subject, created_at)
        VALUES('$email', '$message', '$subject', CURRENT_TIMESTAMP);";
    //
    //Execute the query.
    if($pdo->exec($query)){
        //
        //Display a positive message.
        echo json_encode(["success" => true]);
    }
    else{
        //
        //Display a negative message.
        echo json_encode(["success" => false]);
    }
}
//
//Call the method.
save_message($email, $message, $subject);