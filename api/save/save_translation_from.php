<?php
//
//Bring in the file that checks if a word already exists.
include_once 'check_if_word_exists.php';
//
//Save the word to translate from.
function save_translation_from(){
    //
    //Check if the word already exists in the database.
    $state = check_if_word_exists();
    //
    //After checking if word exists, proceed accordingly.
    if ($state === true) {
        //
        //1. Update the synonym table.
        echo '16 true';
        //
        //2. Update the translation table
    }
    else{
        //
        //1. Update the word table.
        echo 'false';
        //
        //2. Update the synonym table.
        echo 'true';
        //
        //3. Update the translation table
    }
}
//
//
save_translation_from();