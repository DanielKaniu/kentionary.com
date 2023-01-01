<?php
//
include_once '../config.php';
//
//Get the data on the request body;
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['word'];
//
//Get the words to use to search for terms.
$word_one = $word['word'][0];
$word_two = $word['word'][1];
//
//Fetch terms from the database.
class term extends config{
    //
    function search_term($word_one, $word_two){
        //
        //The query that gets the data.
        $query = "SELECT DISTINCT
                    term.name AS object,
                    term.type AS category
            FROM 
                term
            INNER JOIN translation ON translation.term = term.term
            LEFT JOIN definition ON definition.translation_id = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE
                word.name = '$word_one' OR word.name = '$word_two'";
        //
        //Execute the query.
        $statement = $this->connect()->query($query);
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
}
//
//Call the class.
$term_class = new term();
$term_class->search_term($word_one, $word_two);