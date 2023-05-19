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
//The synonym.
$synonym = $word['synonym']['word'];
$language_synonym = $word['synonym']['language'];
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
    public $synonym;
    public $language_from;
    public $language_to;
    public $language_synonym;
    public $term;
    //
    //Connection to database.
    public $pdo;
    //
    //Construct this class using the availed parameters.
    function __construct (
        $translate_from, $translate_to, $synonym, 
        $language_from, $language_to, $language_synonym,
        $term, $pdo
    ) {
        //
        $this->translate_from = $translate_from;
        $this->translate_to = $translate_to;
        $this->synonym = $synonym;
        $this->language_from = $language_from;
        $this->language_to = $language_to;
        $this->language_synonym = $language_synonym;
        $this->term = $term;
        //
        $this->pdo = $pdo;
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
        //Translations already exist in the database.
        if(
            $translate_from === true && 
            $translate_to === true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'none'
                    ]
                );
        }
        //
        //Translation_from, translation_to and synonym don't exit in the database.
        elseif(
            $translate_from !== true && 
            $translate_to !== true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'all'
                    ]
                );
        }
        //
        //Translation_to and synonym in the database not in database.
        elseif(
            $translate_from === true && 
            $translate_to !== true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_to_synonym'
                    ]
                );
        }
        //
        //Translation_from and synonym not in the database.
        elseif(
            $translate_from !== true && 
            $translate_to === true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from_synonym'
                    ]
                );
        }
        //
        //Translation_from and translation_to not in the database.
        elseif(
            $translate_from !== true && 
            $translate_to !== true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from_to'
                    ]
                );
        }
        //
        //Synonym not in the database.
        elseif(
            $translate_from === true && 
            $translate_to == true &&
            $synonym !== true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'synonym'
                    ]
                );
        }
        //
        //Translation_to not in the database.
        elseif(
            $translate_from === true && 
            $translate_to !== true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_to'
                    ]
                );
        }
        //
        //Translation_from not in the database.
        elseif(
            $translate_from !== true && 
            $translate_to === true &&
            $synonym === true){
                //
                echo json_encode(
                    [
                        "success" => true,
                        "data" => 'translation_from'
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
    //
    //Check if the synonym is linked to a term.
    function check_synonym(){
        //
        //The query that gets the data.
        $query = "SELECT DISTINCT
                    term.name AS object,
                    term.type AS category
            FROM term
            INNER JOIN translation ON translation.term = term.term
            LEFT JOIN definition ON definition.translation = translation.translation
            INNER JOIN language ON translation.language = language.language
            INNER JOIN synonym ON synonym.translation = translation.translation
            INNER JOIN word ON synonym.word = word.word
            WHERE word.name = '$this->synonym' 
            AND term.name = '$this->term'
            AND language.name = '$this->language_synonym'";
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
    $translate_from, $translate_to, $synonym, 
    $language_from, $language_to, $language_synonym,
    $term, $pdo
);
$check_class->execute();