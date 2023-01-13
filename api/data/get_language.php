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
$language_class = new language();
$language_class->get_language(); 