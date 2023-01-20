import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { TranslateService } from 'src/services/translate.service';
import { Translation } from 'src/types/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit, AfterViewInit  {
  //
  //
  @ViewChild('tr') t?: ElementRef<HTMLDivElement>;
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
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.translate();
  }

  ngAfterViewInit(): void {
    // console.log(this.t?.nativeElement.innerHTML);
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
    //Check if the content panel is empty or not.
    if (input.value !== '') {
        //
        //Get the word to translate.
        const word: string | null = this.word_control.value;
        //
        //Send the word to translate to the server.
        this.translate_service.get_translation(word).subscribe(
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
              //Get all panels.
              const panels = document.querySelectorAll('.panels');
              //
              //Loop through each panel.
              panels.forEach((panel) => {
                //
                //Clear all panels.
                panel.innerHTML = '';
              });
              //
              //Prompt the user to add a new translation.
              const req = `
                The translation you searched is not found, would you like to translate it?
              `;
              //
              //Get the content panel and attach the prompt to it.
              const content = document.getElementById('content');
              content!.innerText =req;
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
  //Display the snackbar accordingly.
  open_snackbar(message: string) {
    //
    this._snackBar.openFromComponent(terms_snack_bar, {
      duration: 5 * 1000,
      data: { msg: message },
    });
  }
}
