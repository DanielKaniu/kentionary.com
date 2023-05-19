<?php
//
//Bring in the necessary files.
include_once '../config.php';
//
//Get the front-end's payload.
$data = json_decode(file_get_contents('php://input'), 1);
$values = $data['values'];
//
//Get the keyed letter.
$letter = $values['letter'];
$language = $values['language'];
//
//Get the requested matches depending on the button the user presses.
function auto_suggest($letter, $language){
    //
    //Access the pdo object from the config file.
    global $pdo;
    //
    //The query to execute in the database.
    $query = "SELECT DISTINCT word.name
        FROM word
        INNER JOIN synonym on synonym.word = word.word
        INNER JOIN translation on synonym.translation = translation.translation
        INNER JOIN language on translation.language = language.language
        INNER JOIN term on translation.term = term.term
        WHERE word.name LIKE '$letter%'
        AND language.name = '$language'
        LIMIT 5";
     //
    //Execute the query.
    $statement = $pdo->query($query);
    //
    //Bring back the result.
    $row = $statement->fetchAll(PDO::FETCH_ASSOC);
    //
    //Check to see if we have some results.
    //
    //At this point there's no data from the database.
    if(count($row) === 0){
        //
        //Display the potential.
        echo json_encode([
                "ok" => false,
                "data" => "No data"
        ]);
    }
    //
    //At this point there's data from the database.
    if(count($row) > 0){
        //
        //Display the potential.
        echo json_encode(
            [
                "ok" => true,
                "data" => $row
            ]
        );
    }
}
//
//Invoke the function.
auto_suggest($letter, $language);