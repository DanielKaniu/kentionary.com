<?php
//
//Bring in the configuration file.
include_once '../config.php';
//
//Check if the term already exists in the database.
function check_if_term_exists($term, $type){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT term.name FROM term WHERE term.name = '$term' and term.type = '$type'";
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