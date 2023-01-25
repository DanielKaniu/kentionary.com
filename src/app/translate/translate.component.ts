import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { TranslateService } from 'src/services/translate.service';
import { Translation } from 'src/types/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';
import { Router } from '@angular/router';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit  {
  //
  //The state to determine if a user wants to specify the 
  checked?: false;
  //
  //The state to control adding a new translation.
  is_new: boolean = true;
  //
  //The state to control when the user wants to translate.
  is_translate: boolean = true;
  //
  //The state to control displaying the translations.
  is_translated: boolean = true;
  //
  //The word to translate.
  word?: string | null;
  //
  //The language of the word to translate.
  language?: string | null;
  //
  //The word to translate.
  word_control = new FormControl('', Validators.required);
  //
  //Language form control.
  language_control = new FormControl('', Validators.required);
  //
  //The translation  response from the server.
  translations: any = [];
  //
  //Languages to populate the select tag with.
  select_languages: any;
  //
  //The languages.
  languages: any = [];
  //
  //The languages to display on the left panel.
  languages_panel: any = [];
  //
  //Languages and their translations.
  language_translations: any = [];
  //
  //Number of translations.
  translation_count?: number;
  //
  //Translated words.
  word_translations: any = [];
  //
  //Number of translated words.
  word_count: any = [];
  //
  //Translated terms.
  terms: any = [];
  //
  //Number of translated terms.
  term_count?: number;
  //
  //Number of languages of a translation.
  language_count?: number;
  //
  constructor(
    //
    //The language service.
    private language_service: LanguageService,
    //
    //The service that translates.
    private translate_service: TranslateService,
    //
    //The snackbar.
    public _snackBar: MatSnackBar,
    //
    //The router.
    private router: Router
  ) { }
  //
  ngOnInit(): void {
    //
    //Retrieve the list of languages from the database
    this.language_service.get_language().subscribe(
      //
      (response: any) => {
        //
        //Ensure we have some response.
        if (response.success === true) {
          //
          //Get the data and save it globally.
          this.select_languages = response.data;
        }
      }
    );
    // this.translate();
  }
  //
  //Get the translation.
  translate(): void{
    //
    //Show the translation panel.
    this.is_translate = false;
    //
    //The input field.
    const input = document.getElementById('input_word') as HTMLInputElement;
    //
    //The select element.
    //
    //The translations panel.
    const content = document.getElementById('content') as HTMLDivElement;
    //
    //Check if the input field is empty or not.
    if (input.value !== '' && this.language_control.value !== '') {
        //
        //The word to translate.
        this.word = this.word_control.value;
        //
        //The language of the word to translate.
        this.language = this.language_control.value;
        //
        //Send the word to translate to the server.
        this.translate_service.get_translation(this.word, this.language).subscribe(
          //
          //Get some response from the server.
          (response: any) => {
            //
            //The data from the server.
            const data = response.data;
            //
            //Check if the server has sent some results.
            //
            //At this point there are some results.
            if (response.success === true) {
              //
              //Show the translations.
              this.is_new = true;
              //
              //Empty the translations array.
              this.translations = [];
              this.languages = [];
              //
              //Organize the translations received from the database.
              this.dissect_translation(data);
            } 
            //
            //At this point there is no result.
            else {
              //
              //Make the elements for asking the user if to add a new translation or not.
              this.is_new = false;
              //
              //Get the other pan
            }
          }
        );
    } else {
      //
      //Clear the content panel
      content?.innerHTML === '';
      //
      //Ask the user to enter a value.
      this.open_snackbar('Missing value(s)');
    } 
  }
  //
  //Split the languages and words from the translations.
  dissect_translation(data: any): void{
    //
    //First empty the containers.
    this.word_translations = [];
    this.terms = [];
    this.language_translations = [];
    //
    //Loop through the translatations.
    data.forEach((translation_object: any) => {
      //
      //Convert the string into an array.
      const translations = JSON.parse(translation_object.translation);
      //
      //Compile the term and the translations.
      this.translations.push(
        {
          term: `${translation_object.term} (${translation_object.category})`}
      );
      //
      //Save the translated terms globally.
      this.terms.push(translation_object.term);
      //
      //Loop through the array of translation.
      for(const translation in translations){
        //
        //Add the language to the translations array.
        this.translations.push({language: translation});
        //
        //Save the languages globally.
        this.languages.push(translation);
        //
        //The translated words. Remove the square brackets and single quotes.
        const translated = String(translations[translation]).replace(/,/g, ', ');
        //
        //Check if the translated word has a comma, which means they are more than one word.
        if (translated.indexOf(',') > -1) { 
          //
          //Split the string.
          const many_translated = translated.split(', ');
          //
          //Loop through the splitted words.
          many_translated.forEach((word: string) => {
            //
            //Save each word globally.
            this.word_translations.push(word);
          });
        }
        //
        //At this point the translated words have no comma.
        else{
          //
          //Save each word globally.
          this.word_translations.push(translated);
        }
        //
        //Add the translation to the translation array.
        this.translations.push({words: translated});
        //
        //Languages and their translations.
        this.language_translations.push(translations);
      }
    });
    //
    //Ensure the languages are unique and there is no repetition.
    this.languages_panel = [...new Set(this.languages)];
    //
    //Number of languages translated.
    this.language_count = this.languages_panel.length;
    //
    //Number of translated terms.
    this.term_count = this.terms.length;
    //
    //Number of translations.
    this.translation_count = this.language_translations.length;
    //
    //Number of translated words.
    this.word_count = this.word_translations.length;
  }
  //
  //Allow the user create a new translation.
  add_new_translation(): void{
    //
    //The input field.
    const input = document.getElementById('input_word') as HTMLInputElement;
    //
    //First check if the input field has a value.
    if(input.value !== ''){
      //
      //Open the page that lets the user add a new translation.
      this.router.navigate(
        ['/add'], 
        { queryParams: {word: this.word}}  
      );
    }
    //
    //At this point the input field is empty.
    else{
      //
      //Open the page that lets the user add a new translation.
      this.router.navigate(['/add']);
    }
  }
  //
  //Display the snackbar accordingly.
  open_snackbar(message: string) {
    //
    this._snackBar.openFromComponent(terms_snack_bar, {
      duration: 5 * 1000,
      data: { msg: message },
    });
  }
}
