<?php
//
//Bring in the necessary files.
include_once '../create/create.php';
include_once '../check/check_if_word_exists.php';
include_once '../check/check_if_term_exists.php';
include_once '../check/check_word_term_link.php';
include_once '../data/get_ids.php';
//
//Save the newly created term.
function save_term_word($translation_to, $translation_from, $term){
    //
    //Get the term name.
    $term_name = $term['term'];
    //
    //The term's category.
    $term_category = $term['category'];
    //
    //The term's meaning.
    $term_meaning = $term['meaning'];
    //
    //First check if the term and word are linked.
    $state_word_term_link = check_word_term_link($term_name, $term_name, '15');
    //
    //Check if the term already exists in the database.
    $state_term = check_if_term_exists($term_name, $term_category);
    //
    //Ensure we don't have duplicate terms.
    //
    //In this case, the term already exists in the database
    if ($state_term === true) {
        //
        //The term's id.
        $term_id = get_term_id($term_name)['data'];
        //
        //Add the term's meaning in the database.
        create_meaning($term_id, $term_name, '15', $term_meaning);
        //
        //If word and term are linked, then do nothing.
        if($state_word_term_link === true){
            //
            //Display a negative message.
            echo json_encode(
                [
                    "success" => true,
                    "data" => "word & term already linked"
                ]
            ); 
        }
        //
        //Otherwise, link them.
        else{
            //
            //Check if the word exists, then act accordingly.
            save_word($term_name);
        }
    }
    //
    //The term is not in the database, add it.
    else{
        //
        //Add a new term in the database.
        create_term($term_name, $term_category);
        //
        //The term's id.
        $term_id = get_term_id($term_name)['data'];
        //
        //Add the term's meaning in the database.
        create_meaning($term_id, $term_name, '15', $term_meaning);
        //
        //If word and term are linked, then do nothing.
        if($state_word_term_link === true){
            //
            //Display a negative message.
            echo json_encode(
                [
                    "success" => true,
                    "data" => "word & term already linked"
                ]
            ); 
        }
        //
        //Otherwise, link them.
        else{
            //
            //Check if the word exists, then act accordingly.
            save_word($term_name);
        }
    }
}
//
//Check if a word and term exist.
function save_word($term_name){
    //
    //The term's id.
    $new_term_id = get_term_id($term_name)['data'];
    //
    //Check if the word exists in the database.
    //
    //A new term qualifies to be a word in English.
    $state_word = check_if_word_exists($term_name);
    //
    //If the word exists in the database, you create its translation.
    if($state_word === true){
        //
        //The word's id.
        $word_id = get_word_id($term_name)['data'];
        //
        //Create the word's translation.
        //
        //The new term's language should always be English and 15 is the 
        //primary key of the English.
        create_translation_and_synonym($new_term_id, '15', $word_id);    
        //
        //Display a positive message.
        echo json_encode(
            [
                "success" => true,
                "data" => "new term & translation added"
            ]
        );                
    }
    //
    //If the word doesn't exist in the database, then add it.
    else{
        //
        //Add the term as a word in the word table.
        create_word($term_name);
        //
        //Get the new word's id.
        $new_word_id = get_word_id($term_name)['data'];
        //
        //Create the word's translation.
        //
        //The new term's language should always be English.
        create_translation_and_synonym($new_term_id, '15', $new_word_id); 
        //
        //Display a positive message.
        echo json_encode(
            [
                "success" => true,
                "data" => "new term & translation added"
            ]
        );
    }
}