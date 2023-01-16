<?php
//
//Bring in the necessary files.
include_once '../config.php';
include_once 'save_term_word.php';
include_once 'save_all_term_synonym.php';
include_once 'save_from_to_term_no_synonym.php';
//
//Get the data on the request body;
$data = json_decode(file_get_contents('php://input'), 1);
$word = $data['values'];
//
//Get the components of the translation from object.
$translation_from = $word['translation_from'];
$translation_to = $word['translation_to'];
@$synonym = $word['synonym'];
$term = $word['term'];
$synonym_state = $word['synonym_state'];
//
//Fetch terms from the database.
class save_new_term {
    //
    //Declare the vriables that compose a translation.
    public $translation_from;
    public $translation_to;
    public $synonym;
    public $term;
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
        $translation_from, $translation_to, $synonym, $term, $synonym_state, $pdo
    ) {
        //
        $this->translation_from = $translation_from;
        $this->translation_to = $translation_to;
        $this->synonym = $synonym;
        $this->term = $term;
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
            //Get the term's name.
            $term_name = $this->term['term'];
            //
            //First add the new term to the database.
            save_term_word($this->translation_to, $this->translation_from, $this->term);
            //
            //Get the newly created term's id.
            $term_id = get_term_id($term_name)['data'];
            //
            //Save the translation from, translation to and the synonym.
            save_all_term_synonym(
                $this->translation_to, $this->translation_from, $this->synonym, $term_id
            );
        }
        //
        //At this point there no synonyms provided.
        else{
            //
            //Get the term's name.
            $term_name = $this->term['term'];
            //
            //First add the new term to the database.
            save_term_word($this->translation_to, $this->translation_from, $this->term);
            //
            //Get the newly created term's id.
            $term_id = get_term_id($term_name)['data'];
            //
            //Save the translation from and the translation to.
            save_from_to_term_no_synonym(
                $this->translation_to, $this->translation_from, $term_id
            );
        } 
    }
}
//
//Call the class.
$term_class = new save_new_term(
    $translation_from, $translation_to, $synonym, $term, $synonym_state, $pdo
);
$term_class->execute();