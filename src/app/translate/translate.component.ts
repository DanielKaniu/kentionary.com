import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { TranslateService } from 'src/services/translate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';
import { Router } from '@angular/router';
import { LanguageService } from 'src/services/language.service';
import { AutoSuggestService } from 'src/services/auto-suggest.service';
//
@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit  {
  //
  //The show/hide state of the right panel.
  is_hidden_stats?: boolean; 
  //
  //The state to determine if a user wants to specify the 
  checked?: boolean;
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
  //Server data based on the auto-suggesting feature.
  auto_suggest_words?: any;
  //
  //Each suggested word.
  suggestion?: any;
  //
  //The word to translate.
  word?: string | null;
  //
  //The language of the word to translate from.
  language_from?: string | null;
  //
  //The language of the word to translate to.
  language_to?: string | null;
  //
  //The control of the word to translate.
  word_control = new FormControl('', Validators.required);
  //
  //Language form control.
  language_from_control = new FormControl('', Validators.required);
  //
  //Language to control.
  language_to_control = new FormControl('', Validators.required);
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
  //The statistics.
  stats: any = {};
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
    private router: Router,
    //
    //The auto-suggest feature.
    private auto_suggest_service: AutoSuggestService
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
        if (response.ok === true) {
          //
          //Get the data and save it globally.
          this.select_languages = response.data;
        }
      }
    );
    //
    //Hide the statistics.
    this.is_hidden_stats = true;
  }
  //
  //Get the translation.
  translate(): void{
    //
    //The input field.
    const input = document.getElementById('input_word') as HTMLInputElement;
    //
    //The translations panel.
    const content = document.getElementById('content') as HTMLDivElement;
    //
    //Check the state of the checkbox.
    if (this.checked === true) {
      //
      //Check if the input field is empty or not.
      if (input.value !== '' && this.language_from_control.value !== '' && this.language_to_control.value !== '') {
        //
        //The word to translate.
        this.word = this.word_control.value;
        //
        //The language of the word to translate.
        this.language_from = this.language_from_control.value;
        //
        //The language of the word to translate.
        this.language_to = this.language_to_control.value;
        //
        //Send the word to translate to the server(with the language from and language to).
        this.translate_service.get_translation_filter(this.word, this.language_from, this.language_to).subscribe(
          //
          //Get some response from the server.
          (response: any) => {
            //
            //The data from the server.
            const data = response.data;
            //
            //Show the translation panel.
            this.is_translate = false;
            //
            //Check if the server has sent some results.
            //
            //At this point there are some results.
            if (response.ok === true) {
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
              //Alert the user.
              this.open_snackbar('Tip💡: Ensure the languages + word match.');
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
    //At this point, the filter is off
    else {
      //
      //Check if the input field is empty or not.
      if (input.value !== '' && this.language_from_control.value !== '') {
        //
        //The word to translate.
        this.word = this.word_control.value;
        //
        //The language of the word to translate.
        this.language_from = this.language_from_control.value;
        //
        //Send the word to translate to the server.
        this.translate_service.get_translation(this.word, this.language_from).subscribe(
          //
          //Get some response from the server.
          (response: any) => {
            //
            //The data from the server.
            const data = response.data;
            //
            //Show the translation panel.
            this.is_translate = false;
            //
            //Check if the server has sent some results.
            //
            //At this point there are some results.
            if (response.ok === true) {
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
              //Hide the statistics.
              this.is_hidden_stats = true;
              //
              //Alert the user.
              this.open_snackbar('Tip💡: Ensure the language + word match.');
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
    //
    //Show the statistics.
    this.is_hidden_stats = false;
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
      //Check if the filter is selected.
      //
      //At this point the filter button is selected.
      if (this.is_new !== true ) {
        //Open the page that lets the user add a new translation.
        this.router.navigate(
          ['/add'], 
          { 
            queryParams: {
              word: this.word, 
              language_from: this.language_from,
              language_to: this.language_to
          }
          }  
        );
      }
      //
      //At this point the filter is not selected.
      else{
        //
        //Open the page that lets the user add a new translation.
        this.router.navigate(
          ['/add'], 
          { 
            queryParams: {
              word: this.word, 
              language_from: this.language_from
          }
          }  
        );
      }
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
  //Get the status of the checkbox.
  checkbox_changed(value: boolean):void {
    //
    //Save the value globally.
    this.checked = value;
  }
  //
  //Detect keyup changes in the input field.
  auto_suggest(event: any){
    //
    //Compile the payload data.
    // const values = {
    //   letter: event.target.value,
    //   language: this.language_from_control.value
    // }
    const letter = event.target.value;
    const language = this.language_from_control.value
    //
    //Call ther service responsible for the auto-suggest feature.
    this.auto_suggest_service.auto_suggest(
      letter, language!
    ).subscribe(
      //
      //The server response.
      (response: any)=>{
        //
        //Check if I get back some server data.
        if(response.ok === true){
          //
          //Save the server data globally.
          this.auto_suggest_words = response.data;
          //
          //Loop through the suggestions.
          this.auto_suggest_words?.forEach((suggestion: any) => {
            //
            //The words suggested to the user.
            this.suggestion = suggestion;
          })
          //
          this.word_control.valueChanges.subscribe(newValue=>{
            this.auto_suggest_words = this.filterValues(newValue!);
        })
        }
        //
        //At this point there is no server data.
        else{

        }
      }
    );
  }
  //
  filterValues(search: string) {
    return this.auto_suggest_words!.filter((value: any)=>
    value.toString().toLowerCase().indexOf(search.toLowerCase()) === 0);
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
