<?php
//
//Get the necessary files.
include_once '../config.php';
//
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['word'];
//
//Translate the word provided by the user.
function get_language($word){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT 
            term.name AS object,
            term.type AS category,
            definition.meaning as meaning
        FROM 
            term
        INNER JOIN translation ON translation.term = term.term
        LEFT JOIN definition ON definition.translation = translation.translation
        INNER JOIN language ON translation.language = language.language
        INNER JOIN synonym ON synonym.translation = translation.translation
        INNER JOIN word ON synonym.word = word.word
        WHERE
            word.name = '$word';";
    //
    //Execute the query.
    $statement = $pdo->query($query);
    //
    //Bring back the result.
    while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
        //
        if($row){
            //
            //Display the potential.
            echo json_encode(
                [
                    "success" => true,
                    "data" => $row
                ]
            );
        }
        else{
            //
            echo json_encode(
                [
                    "success" => false,
                    "data" => "No data"
                ]
            );
        }
    }
}
//
get_language($word);