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
                result.term,
                result.category,
                JSON_OBJECTAGG(result.language, result.translation) as translation
            FROM(
                SELECT 
                    term.name as term, 
                    language.name as language, 
                    term.type as category,
                    JSON_ARRAYAGG(word.name) as translation
                FROM language
                INNER JOIN translation on translation.language = language.language
                INNER JOIN term on translation.term = term.term
                INNER JOIN synonym on synonym.translation = translation.translation
                INNER JOIN word on synonym.word = word.word
                INNER JOIN (
                    SELECT word.name, term.term
                    FROM word
                    INNER JOIN synonym on synonym.word = word.word
                    INNER JOIN translation on synonym.translation = translation.translation
                    INNER JOIN term on translation.term = term.term
                    WHERE word.name = '$word'
                ) AS search ON search.term = term.term
                GROUP BY term.name, language.name, term.type
            ) as result
            GROUP BY result.term, result.category";
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
                    "success" => false,
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
                    "success" => true,
                    "data" => $row
                ]
            );
        }
}
//
get_language($word);