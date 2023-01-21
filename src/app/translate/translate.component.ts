import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { TranslateService } from 'src/services/translate.service';
import { Translation } from 'src/types/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit  {
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
  //The word to translate.
  word_control = new FormControl('mucii', Validators.required);
  //
  //The translation  response from the server.
  translations: any = [];
  //
  //The languages.
  languages: any = [];
  //
  //The languages to display on the left panel.
  languages_panel: any = [];

  constructor(
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

  ngOnInit(): void {
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
    //The translations panel.
    const content = document.getElementById('content') as HTMLDivElement;
    //
    //Check if the content panel is empty or not.
    if (input.value !== '') {
        //
        //Get the word to translate.
        this.word = this.word_control.value;
        //
        //Send the word to translate to the server.
        this.translate_service.get_translation(this.word).subscribe(
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
      this.open_snackbar('Enter a word to translate');
    } 
  }
  //
  //Split the languages and words from the translations.
  dissect_translation(data: any): void{
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
      //Loop through the array of translation.
      for(const translation in translations){
        //
        //Add the language to the translations array.
        this.translations.push({language: translation});
        //
        //Save the languages globally.
        this.languages.push(translation);
        //
        //The translated words.
        const translated = String(translations[translation]).replace(/,/g, ', ');
        //
        //Add the translation to the translation array.
        this.translations.push({words: translated});
      }
    });
    //
    //Ensure the languages are unique and there is no repetition.
    this.languages_panel = [...new Set(this.languages)];
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
