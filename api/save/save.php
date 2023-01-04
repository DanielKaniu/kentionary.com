<?php
//
include_once '../config.php';
include_once 'save_translation_from.php';
//
//Get the data on the request body;
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['values'];
//
//Get the components of the translation from object.
$translation_from = $word['translation_from'];
$translation_to = $word['translation_to'];
$synonym = $word['synonym'];
$term = $word['term'];
//
//Fetch terms from the database.
class save extends config{
    //
    //Declare the vriables that compose a translation.
    public $translation_from;
    public $translation_to;
    public $synonym;
    public $term;
    //
    //Construct this class using the availed parameters.
    function __construct ($translation_from, $translation_to, $synonym, $term) {
        //
        $this->translation_from = $translation_from;
        $this->translation_to = $translation_to;
        $this->synonym = $synonym;
        $this->term = $term;
    }
    //
    function execute(){
        $t = $this->translation_to;
        //
        //Save 
    }
    //
    function save_all($word_one, $word_two){
        //
        //The query that gets the data.
        $query = "";
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
$term_class = new save($translation_from, $translation_to, $synonym, $term);
$term_class->execute();