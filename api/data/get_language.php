<?php
//
include_once '../config.php';
//
//Fetch languages from the database.
class language extends config{
    //
    function get_language(){
        //
        //The query that gets the data.
        $query = 'SELECT * FROM language';
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
$language_class = new language();
$language_class->get_language(); 