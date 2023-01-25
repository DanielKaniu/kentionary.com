<?php
//
include_once '../config.php';
//
//Fetch languages from the database.
class language{
    //
    function get_language(){
        //
        //Use the pdo connection established in the config file.
        global $pdo;
        //
        //The query that gets the data.
        $query = 'SELECT * FROM language';
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
}
//
//Call the class.
$language_class = new language();
$language_class->get_language(); 