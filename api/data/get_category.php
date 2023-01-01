<?php
//
//Bring in the configuration file.
include_once '../config.php';
//
//Fetch categories from the database.
class category extends config{
    //
    function get_category(){
        //
        //The query that gets the data.
        $query = 'SELECT DISTINCT 
                    term.type as category 
                FROM `term`
                WHERE term.type IS NOT NULL';
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
$category_class = new category();
$category_class->get_category(); 