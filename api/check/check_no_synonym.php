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
$language_from = $word['translate_from']['language'];
//
//The word to translate to.
$translate_to = $word['translate_to']['word'];
$language_to = $word['translate_to']['language'];
//
//The term name.
$term = $word['term'];
//
//Check if a translation exists in the database.
class check {
    //
    //Declare the vriables that compose a translation.
    public $translate_from;
    public $translate_to;
    public $language_from;
    public $language_to;
    public $term;
    //
    //Connection to database.
    public $pdo;
    //
    //Construct this class using the availed parameters.
    function __construct (
        $translate_from, $translate_to,
        $language_from, $language_to, 
        $term, $pdo
    ) {
        //
        $this->translate_from = $translate_from;
        $this->translate_to = $translate_to;
        $this->language_from = $language_from;
        $this->language_to = $language_to;
        $this->term = $term;
        //
        $this->pdo = $pdo;
    }
    //
    //The main method.
    function execute(){
        //
        //Use the pdo connection established in the config file.
        global $pdo;
        //
        //The results from interrogating the database.
        $translate_from = $this -> check_translate_from();
        $translate_to = $this -> check_translate_to();
        //
        //Check if there are links between words and a term.
        //
        //Translations already exist in the database.
        if($translate_from === true && $translate_to === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'none'
                    ]
                );
        }
        //
        //Translation_to is not in database.
        elseif($translate_from === true && $translate_to !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_to'
                    ]
                );
        }
        //
        //Translation_from is not in the database.
        elseif($translate_from !== true && $translate_to === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from'
                    ]
                );
        }
        //
        //Translation_from and translation_to are not in the database.
        elseif($translate_from !== true && $translate_to !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from_to'
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
            LEFT JOIN definition ON definition.translation = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE word.name = '$this->translate_from' 
            AND term.name = '$this->term'
            AND language.name = '$this->language_from'";
        //
        //Execute the query.
        $statement = $this->pdo->query($query);
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
            LEFT JOIN definition ON definition.translation = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE word.name = '$this->translate_to' 
            AND term.name = '$this->term'
            AND language.name = '$this->language_to'";
        //
        //Execute the query.
        $statement = $this->pdo->query($query);
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
$check_class = new check(
    $translate_from, $translate_to, 
    $language_from, $language_to,
    $term, $pdo
);
$check_class->execute();