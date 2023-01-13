<?php
//
//Bring in the necessary files.
include_once '../check/check_if_word_exists.php';
include_once '../check/check_word_term_link.php';
include_once '../create/create.php';
include_once '../data/get_ids.php';
//
//Save the word to translate from.
function save_translation_to($translation_to, $translation_from, $synonym, $term){
    //
    //The words to add in the database.
    $word_from = $translation_from['word'];
    $word_to = $translation_to['word'];
    $word_synonym = $synonym['word']; 
    //
    //The words' ids.
    $word_from_id = get_word_id($word_from)['data'];
    $word_to_id = get_word_id($word_to)['data'];
    $word_synonym_id = get_word_id($word_synonym)['data'];
    //
    //The words' language.
    $language_from = $translation_from['language'];
    $language_to = $translation_to['language'];
    $language_synonym = $synonym['language'];
    //
    //The languages' id.
    $language_from_id = get_language_id($language_from)['data'];
    $language_to_id = get_language_id($language_to)['data'];
    $language_synonym_id = get_language_id($language_synonym)['data'];
    //
    //The term to link with a word.
    $term_to = $term['term'];
    //
    //The term's id.
    $term_id = get_term_id($term_to)['data'];
    //
    //The meanings of the word.
    $meaning_from = $translation_from['meaning'];
    $meaning_to = $translation_to['meaning'];
    $meaning_synonym = $synonym['meaning'];
    //
    //The example sentences.
    $example_from = $translation_from['sentence'];
    $example_to = $translation_to['sentence'];
    $example_synonym = $synonym['sentence'];
    //
    //Check if the word already exists in the database.
    $state_to = check_if_word_exists($word_to);
    //
    //After checking if word exists in the word table, save the word and the synonym.
    if ($state_to === true) {
        ///
            //1. Create the required translation and synonym (for the word to translate from).
            create_translation_and_synonym($term_id, $language_to_id, $word_to_id);
            //
            //Add the meaning and example for the word to translate to.
            create_meaning_example($term_id, $word_to, $language_to_id, $meaning_to, $example_to);
            //
            //Add the meaning and example for the word to translate from.
            create_meaning_example($term_id, $word_from, $language_from_id, $meaning_from, $example_from);
            //
            //Add the meaning and example for the synonym.
            create_meaning_example($term_id, $word_synonym, $language_synonym_id, $meaning_synonym, $example_synonym);
    }
    //
    //Neither the word nor its synonym exist in the database.
    else{
       //
        // Create the word, its synonym and translation. This will link them to the 
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
        //
        //Add the meaning and example for the synonym.
        create_meaning_example(
            $term_id, $word_synonym, $language_synonym_id, $meaning_synonym, $example_synonym);
    }
}