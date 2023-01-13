<?php
//
//Bring in the configuration file.
include_once '../config.php';
//
//Check if the the current word is linked to the selected term.
function check_word_term_link($word, $term, $language_id){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The name of the term.
    // $term_name = $term['term'];
    //
    //The query that gets the data.
    $query = "SELECT DISTINCT
            term.term
        FROM 
        term
        INNER JOIN translation ON translation.term = term.term
        LEFT JOIN definition ON definition.translation = translation.translation
        INNER JOIN language ON translation.language = language.language
        INNER JOIN synonym ON synonym.translation = translation.translation
        INNER JOIN word ON synonym.word = word.word
        WHERE
        word.name = '$word' 
        AND term.name = '$term'
        AND language.language = '$language_id'";
    //
    //Execute the query.
    $statement = $pdo->query($query);
    //
    //Bring back the result.
    while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
        //
        //Return true if the word exists in the database.
        if(count($row) >= 1){
            //
            //Return a boolean value that will help take further action.
            return true;
        }
        //
        //Otherwise return false.
        else{
            //
            //Return a boolean value that will help take further action.
            return false;
        }
    }
}