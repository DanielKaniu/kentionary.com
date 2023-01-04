<?php
//
//Check if the word already exists in the database.
function check_if_word_exists(){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "SELECT * FROM word WHERE word.name = 'nyumba'";
    //
    //Execute the query.
    $statement = $pdo->query($query);
    //
    //Bring back the result.
    while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
        //
        if(count($row) >= 1){
            //
            //Display the potential.
            return true;
        }
        else{
            //
            return false;
        }
    }
}