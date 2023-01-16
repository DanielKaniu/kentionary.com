<?php
//
//Bring in the necessary files.
include_once '../check/check_if_word_exists.php';
include_once '../create/create.php';
include_once '../data/get_ids.php';
//
//Save the word to translate from.
function save_from_to_term_no_synonym($translation_to, $translation_from, $term_id){
    //
    //The words to add in the database.
    $word_from = $translation_from['word'];
    $word_to = $translation_to['word'];
    //
    //The words' ids.
    $word_from_id = get_word_id($word_from)['data'];
    $word_to_id = get_word_id($word_to)['data'];
    //
    //The words' language.
    $language_from = $translation_from['language'];
    $language_to = $translation_to['language'];
    //
    //The languages' id.
    $language_from_id = get_language_id($language_from)['data'];
    $language_to_id = get_language_id($language_to)['data'];
    //
    //The meanings of the word.
    $meaning_from = $translation_from['meaning'];
    $meaning_to = $translation_to['meaning'];
    //
    //The example sentences.
    $example_from = $translation_from['sentence'];
    $example_to = $translation_to['sentence'];
    //
    //Check if the word already exists in the database.
    $state_from = check_if_word_exists($word_from);
    $state_to = check_if_word_exists($word_to);
    //
    //After checking if word exists in the word table, proceed accordingly.
    //
    //In this case, both the word to translate from and the synonym exist in the database.
    if ($state_from === true && $state_to === true) {
            //
            //1. Create the required translation and synonym (for the word to translate from).
            create_translation_and_synonym($term_id, $language_from_id, $word_from_id);
            //
            //1. Create the required translation and synonym (for the word to translate to).
            create_translation_and_synonym($term_id, $language_to_id, $word_to_id);
            //
            //Add the meaning and example for the word to translate from.
            create_meaning_example($term_id, $word_from, $language_from_id, $meaning_from, $example_from);
            //
            //Add the meaning and example for the word to translate to.
            create_meaning_example($term_id, $word_to, $language_to_id, $meaning_to, $example_to);
    }
    //
    //Only the word to translate from exists in the database.
    elseif($state_from === true && $state_to !== true){
        //
        //1. Create the required translation and synonym (for the word to translate to).
        create_translation_and_synonym($term_id, $language_from_id, $word_from_id);
        //
        //Add the meaning and example for the word to translate from.
        create_meaning_example($term_id, $word_from, $language_from_id, $meaning_from, $example_from);
        //
        //Add the meaning and example for the word to translate to.
        create_meaning_example($term_id, $word_to, $language_to_id, $meaning_to, $example_to);
    }
    //
    //Only the word to translate to exists in the database.
    elseif($state_from !== true && $state_to === true){
        //
        //1. Create the required translation and synonym (for the synonym).
        create_translation_and_synonym($term_id, $language_to_id, $word_to_id);
        //
        //Add the meaning and example for the word to translate from.
        create_meaning_example($term_id, $word_from, $language_from_id, $meaning_from, $example_from);
        //
        //Add the meaning and example for the word to translate to.
        create_meaning_example($term_id, $word_to, $language_to_id, $meaning_to, $example_to);
    }
    //
    //Neither the word to translate to and the synonym exist in the database.
    elseif($state_from !== true && $state_to !== true){
        //
        // Create the word to translate from, its synonym and translation. This will link them to the 
        //right term.
        create_word_translation_synonym(
            $term_id, $language_from_id, $word_from, $meaning_from, $example_from
        );
        //
        // Create the word to translate to, its synonym and translation. This will link them to the 
        //right term.
        create_word_translation_synonym(
            $term_id, $language_to_id, $word_to, $meaning_to, $example_to
        );
        //
        //Add the meaning and example for the word to translate from.
        create_meaning_example($term_id, $word_from, $language_from_id, $meaning_from, $example_from);
        //
        //Add the meaning and example for the word to translate to.
        create_meaning_example($term_id, $word_to, $language_to_id, $meaning_to, $example_to);
    }
}