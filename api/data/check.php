<?php
//
include_once '../config.php';
//
//Get the data on the request body;
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['values'];
//
//The word to translate from.
$translate_from = $word['translate_from']['word'];
//
//The word to translate from.
$translate_to = $word['translate_to']['word'];
//
//The word to translate from.
$synonym = $word['synonym']['word'];
//
//The term name.
$term = $word['term'];
//
//Fetch terms from the database.
class check extends config{
    //
    //Declare the vriables that compose a translation.
    public $translate_from;
    public $translate_to;
    public $synonym;
    public $term;
    //
    //Construct this class using the availed parameters.
    function __construct ($translate_from, $translate_to, $synonym, $term) {
        //
        $this->translate_from = $translate_from;
        $this->translate_to = $translate_to;
        $this->synonym = $synonym;
        $this->term = $term;
    }
    //
    //The main method.
    function execute(){
        //
        //The results from interrogating the database.
        $translate_from = $this -> check_translate_from();
        $translate_to = $this -> check_translate_to();
        $synonym = $this -> check_synonym();
        //
        //Check if there are links between words and a term.
        //
        //Translation from + translation to + term
        if(
            $translate_from === true && 
            $translate_to === true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'all'
                    ]
                );
        }
        //
        //None.
        elseif(
            $translate_from !== true && 
            $translate_to !== true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'none'
                    ]
                );
        }
        //
        //Translation from only.
        elseif(
            $translate_from === true && 
            $translate_to !== true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from'
                    ]
                );
        }
        //
        //Translation to only.
        elseif(
            $translate_from !== true && 
            $translate_to === true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_to'
                    ]
                );
        }
        //
        //Synonym only.
        elseif(
            $translate_from !== true && 
            $translate_to !== true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'synonym'
                    ]
                );
        }
        //
        //Translation from + translation to.
        elseif(
            $translate_from === true && 
            $translate_to == true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from_to'
                    ]
                );
        }
        //
        //Translation from + synonym.
        elseif(
            $translate_from === true && 
            $translate_to !== true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from_synonym'
                    ]
                );
        }
        //
        //Translation to + synonym.
        elseif(
            $translate_from !== true && 
            $translate_to === true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_to_synonym'
                    ]
                );
        }
    }
    //
    //Check if the word to translate is linked to a term.
    function check_translate_from(){
        //
        //The query that gets the data.
        $query = "SELECT DISTINCT
                    term.name AS object,
                    term.type AS category
            FROM 
                term
            INNER JOIN translation ON translation.term = term.term
            LEFT JOIN definition ON definition.translation_id = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE
                word.name = '$this->translate_from' AND term.name = '$this->term'";
        //
        //Execute the query.
        $statement = $this->connect()->query($query);
        //
        //Bring back the result.
        while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
            //
            if(count($row) >= 1){
                //
                return true;
            }
            else{
                //
                return false;
            }
        }
    }
    //
    //Check if the word to translate is linked to a term.
    function check_translate_to(){
        //
        //The query that gets the data.
        $query = "SELECT DISTINCT
                    term.name AS object,
                    term.type AS category
            FROM 
                term
            INNER JOIN translation ON translation.term = term.term
            LEFT JOIN definition ON definition.translation_id = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE
                word.name = '$this->translate_to' AND term.name = '$this->term'";
        //
        //Execute the query.
        $statement = $this->connect()->query($query);
        //
        //Bring back the result.
        while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
            //
            if(count($row) >= 1){
                //
                return true;
            }
            else{
                //
                return false;
            }
        }
    }
    //
    //Check if the synonym is linked to a term.
    function check_synonym(){
        //
        //The query that gets the data.
        $query = "SELECT DISTINCT
                    term.name AS object,
                    term.type AS category
            FROM 
                term
            INNER JOIN translation ON translation.term = term.term
            LEFT JOIN definition ON definition.translation_id = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE
                word.name = '$this->synonym' AND term.name = '$this->term'";
        //
        //Execute the query.
        $statement = $this->connect()->query($query);
        //
        //Bring back the result.
        while ($row = $statement->fetchAll(PDO::FETCH_ASSOC)) {
            //
            if(count($row) >= 1){
                //
                return true;
            }
            else{
                //
                return false;
            }
        }
    }
}
//
//Call the class.
$check_class = new check($translate_from, $translate_to, $synonym, $term);
$check_class->execute();