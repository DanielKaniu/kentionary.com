<?php
//
//Bring in the necessary files.
include_once '../config.php';
include_once '../data/get_ids.php';
//
//Create a new translation using the language and the word's term.
function create_translation_and_synonym($term_id, $language_id, $word_id){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "INSERT INTO translation(term, language, created_at)
            VALUES ('$term_id','$language_id', CURRENT_TIMESTAMP);
        SET @last_id_in_translation = LAST_INSERT_ID();
        INSERT INTO synonym(word, translation, is_valid, created_at)
            VALUES ('$word_id', @last_id_in_translation, 0, CURRENT_TIMESTAMP);";
    //
    //Execute the query.
    $pdo->exec($query);
}
//
//Create the word, its synonym and translation. This will link them to the 
//right term.
function create_word_translation_synonym($term_id, $language_id, $word, $meaning, $example){
    //
    //Create a new word in the word table.
    create_word($word);
    //
    //Get the word's id.
    $word_id = get_word_id($word)['data'];
    //
    //The query that gets the data.
    create_translation_and_synonym($term_id, $language_id, $word_id);
}
//
//Create a new word in the word table.
function create_word($word){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "INSERT INTO word(name, created_at)
        VALUES ('$word', CURRENT_TIMESTAMP);";
    //
    //Execute the query.
    if($pdo->exec($query)){
        return true;
    }
    else{
        return false;
    }  
}
//
//Create a new term which is provided by the user.
function create_term($term_name, $term_category){
    //
    //Use the pdo connection established in the config file.
    global $pdo;
    //
    //The query that gets the data.
    $query = "INSERT INTO term(name, type, is_valid, created_at)
        VALUES ('$term_name', '$term_category', 0, CURRENT_TIMESTAMP);";
    //
    //Execute the query.
    $pdo->exec($query);
}
//
//Add both meaning and example in the database.
function create_meaning_example($term_id, $word, $language_id, $meaning, $example){
    //
    //Create the meaning.
    create_meaning($term_id, $word, $language_id, $meaning);
    //
    //Create the example.
    create_example($term_id, $word, $language_id, $example);
}
//
//Add the meaning for the word.
function create_meaning($term_id, $word, $language_id, $meaning){
    //
    //Ensure we have a value before saving it.
    if(!empty($meaning)){
        //
        //Use the pdo connection established in the config file.
        global $pdo;
        //
        //Get the translation's id.
        $translation_id = get_translation_id($term_id, $language_id, $word)['data'];
        //
        //The query that gets the data.
        $query = "INSERT INTO definition(meaning, translation, created_at)
                    VALUES ('$meaning', $translation_id, CURRENT_TIMESTAMP);";
        //
        //Execute the query.
        $pdo->exec($query); 
    }
    else{
        return false;
    }
}
//
//Add the example for the word.
function create_example($term_id, $word, $language_id, $example){
    //
    //Ensure we have a value before saving it.
    if(!empty($example)){
        //
        //Use the pdo connection established in the config file.
        global $pdo;
        //
        //Get the translation's id.
        $translation_id = get_translation_id($term_id, $language_id, $word)['data'];
        //
        //The query that gets the data.
        $query = "INSERT INTO examples(sentence, translation, created_at)
                VALUES ('$example', $translation_id, CURRENT_TIMESTAMP);";
        //
        //Execute the query.
        $pdo->exec($query);
    }
    else{
        return false;
    }
}