<?php
//
//Bring in the necessary files.
include_once '../config.php';
include_once 'save_translation_from.php';
include_once 'save_translation_to.php';
include_once 'save_synonym.php';
include_once 'save_translation_to_synonym.php';
include_once 'save_translation_from_synonym.php';
include_once 'save_translation_from_to.php';
include_once 'save_all.php';

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
$type = $word['type'];
$synonym_state = $word['synonym_state'];
//
//Fetch terms from the database.
class save {
    //
    //Declare the vriables that compose a translation.
    public $translation_from;
    public $translation_to;
    public $synonym;
    public $term;
    public $type;
    public $synonym_state;
    //
    //Connection to database.
    public $pdo;
    //
    //The state of a method, if it has executed or not;
    public $mtd_state = false;
    //
    //Construct this class using the availed parameters.
    function __construct (
        $translation_from, $translation_to, $synonym, $term, $type, $synonym_state, $pdo
    ) {
        //
        $this->translation_from = $translation_from;
        $this->translation_to = $translation_to;
        $this->synonym = $synonym;
        $this->term = $term;
        $this->type = $type;
        $this->synonym_state = $synonym_state;
        //
        $this->pdo = $pdo;
    }
    //
    function execute(){
        //
        //Check if the user has provided some synonyms.
        if ($this->synonym_state === true) {
            //
            //Loop through the types to add to the database.
            switch($this->type){
                //
                //Save the translation_from, translation_to and synonym. Link them to the 
                //selected term.
                case 'all':
                    //
                    save_all(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                //Save the translation_to and synonym in the database, link them with the 
                //selected term.
                case 'translation_to_synonym':
                    //
                    save_translation_to_synonym(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                //Save the translation_from and synonym in the database, link them with the 
                //selected term.
                case 'translation_from_synonym':
                    //
                    save_translation_from_synonym(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                //Save the translation_from and translation_to in the database, link them with the 
                //selected term.
                case 'translation_from_to':
                    //
                    save_translation_from_to(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                //Save the synonym in the database, link it with the selected term.
                case 'synonym':
                    //
                    save_synonym(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    break;
                //
                //Save the translation_to in the database, link it with the selected term.
                case 'translation_to':
                    //
                    save_translation_to(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                       //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    break;
                //
                //Save the word to translate_from in the database, link it with the selected term.
                case 'translation_from':
                    //
                    $save = save_translation_from(
                        $this->translation_from, $this->translation_to, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                default:
                    //
                    //It is extremely hard to reach this point.
                    //
                    //Return false.
                    echo json_encode(["success" => false]);
                    //
                    break;
            }
        }
        //
        //At this point there no synonyms provided.
        else{
            //
            //Loop through the types to add to the database.
            switch($this->type){
                //
                //Save the translation_from and translation_to in the database, link them with the 
                //selected term.
                case 'translation_from_to':
                    //
                    save_translation_from_to(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                //Save the translation_to in the database, link it with the selected term.
                case 'translation_to':
                    //
                    save_translation_to(
                        $this->translation_to, $this->translation_from, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                       //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    break;
                //
                //Save the word to translate_from in the database, link it with the selected term.
                case 'translation_from':
                    //
                    $save = save_translation_from(
                        $this->translation_from, $this->translation_to, $this->synonym, $this->term
                    );
                    //
                    //At this point the method has executed.
                    $this->mtd_state = true;
                    //
                    //Ensure the method is executed.
                    if($this->mtd_state === true){
                        //
                        //Send a response to the front-end.
                        echo json_encode(["success" => true]);
                    }
                    else{
                        //
                        //Return false.
                        echo json_encode(["success" => false]);
                    }
                    //
                    break;
                //
                default:
                    //
                    //It is extremely hard to reach this point.
                    //
                    //Return false.
                    echo json_encode(["success" => false]);
                    //
                    break;
            }
        } 
    }
}
//
//Call the class.
$term_class = new save(
    $translation_from, $translation_to, $synonym, $term, $type, $synonym_state, $pdo
);
$term_class->execute();