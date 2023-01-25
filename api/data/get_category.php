<?php
//
//Bring in the configuration file.
include_once '../config.php';
//
//Fetch categories from the database.
class category{
    //
    function get_category(){
        //
        //Use the pdo connection established in the config file.
        global $pdo;
        //
        //The query that gets the data.
        $query = 'SELECT DISTINCT 
                    term.type as category 
                FROM `term`
                WHERE term.type IS NOT NULL';
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
$category_class = new category();
$category_class->get_category(); 