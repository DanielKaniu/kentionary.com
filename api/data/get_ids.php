<?php
//
//Bring in the configuration file.
include_once '../config.php';
//
//Get the language's id.
function get_language_id($language){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT 
            language.language 
        FROM language
        WHERE
            language.name = '$language'";
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
            return [
                    "success" => true,
                    "data" => $row[0]['language']
                ];
        }
        //
        //Otherwise return false.
        else{
            //
            //Return a boolean value that will help take further action.
            return ["success" => false];
        }
    }
}
//
//Get the term's id
function get_term_id($term){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT 
            term.term
        FROM term
        WHERE
            term.name = '$term'";
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
            return [
                    "success" => true,
                    "data" => $row[0]['term']
                ];
        }
        //
        //Otherwise return false.
        else{
            //
            //Return a boolean value that will help take further action.
            return ["success" => false];
        }
    }
}
//
//Get the translation's id.
function get_translation_id($term_id, $language_id, $word){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT DISTINCT
            translation.translation
        FROM term
        INNER JOIN translation ON translation.term = term.term
        LEFT JOIN definition ON definition.translation = translation.translation
        INNER JOIN language ON translation.language = language.language
        INNER JOIN synonym ON synonym.translation = translation.translation
        INNER JOIN word ON synonym.word = word.word
        WHERE term.term = '$term_id'
        AND language.language = '$language_id' 
        AND word.name = '$word' ";
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
            return [
                "success" => true,
                "data" => $row[0]['translation']
            ];
        }
        //
        //Otherwise return false.
        else{
            //
            //Return a boolean value that will help take further action.
            return ["success" => false];
        }
    }
}
//
//Get the word's id.
function get_word_id($word){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT 
            word.word
        FROM word
        WHERE
            word.name = '$word'";
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
            return [
                    "success" => true,
                    "data" => $row[0]['word']
                ];
        }
        //
        //Otherwise return false.
        else{
            //
            //Return a boolean value that will help take further action.
            return ["success" => false];
        }
    }
}