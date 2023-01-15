<?php
//
//Bring in the necessary files.
include_once '../create/create.php';
include_once '../check/check_if_word_exists.php';
include_once '../check/check_if_term_exists.php';
//
//Save the newly created term.
function save_term_synonym($translation_to, $translation_from, $synonym, $term){
    //
    //Get the term name.
    $term_name = $term['term'];
    //
    //The term's category.
    $term_category = $term['category'];
    //
    //Check if the term already exists in the database.
    $state_term = check_if_term_exists($term_name, $term_category);
    //
    //Ensure we don't have duplicate terms.
    //
    //In this case, the term already exists in the database
    if ($state_term === true) {
        //
        //Display a negative message.
        echo json_encode(
            [
                "success" => false,
                "data" => "term_exists"
            ]
        );
    }
    //
    //The term is not in the database, add it.
    else{
        //
        //Add a new term in the database.
        $state_new_term = create_term($term_name, $term_category);
        //
        //Check that adding the new term was successful.
        if($state_new_term === true){
            //
            //Get the term's details.
            $new_term = get_term_id($term_name);
            //
            //Get the term id.
            $new_term_id = $new_term['data'];
            //
            //Ensure we have the term's id.
            if($new_term['success'] === true){
                //
                //Check if the word exists in the database.
                $state_word = check_if_word_exists($term_name);
                //
                //The word's id.
                $word_id = get_word_id($term_name)['data'];
                //
                //If the word exists in the database, you create its translation.
                if($state_word === true){
                    //
                    //Create the word's translation.
                    //
                    //The new term's language should always be English.
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
                    $new_word = create_word($term_name);
                    //
                    //Check that adding the new word was successful.
                    if($new_word === true){
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
            }
            else{
                //
                //Display a negative message.
                echo json_encode(
                    [
                        "success" => false,
                        "data" => "unable to get term id"
                    ]
                );
            }
        }
        else{
            //
            //Display a message.
            echo json_encode(
                [
                    "success" => false,
                    "data" => "adding term failed"
                ]
            );
        }
    }
}