import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { CategoryService } from 'src/services/category.service';
import { LanguageService } from 'src/services/language.service';
import { Category, Check, Language, New_term, Word_for_term, Word_to_save } from 'src/types/types';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';
import { terms_dialog } from '../dialog/dialog';
import { CheckService } from 'src/services/check.service';
import { SaveService } from 'src/services/save.service';
//
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
//
export class AddComponent implements OnInit {
  //
  //Get the expansion panels.
  @ViewChild('exp_one') exp_one!: ElementRef;
  @ViewChild('exp_two') exp_two!: ElementRef;
  @ViewChild('exp_three') exp_three!: ElementRef;
  //
  //Show/hide the expansion panels.
  is_disabled?: boolean = true;
  //
  //Each step of an expansion panel.
  step = 0;
  //
  //The term/object the user wants to translate.
  selected_term?: New_term;
  //
  //The word(s) to translate.
  translate_from_control = new FormControl('nyumba', Validators.required);
  translate_to_control = new FormControl('home', Validators.required);
  //
  //Example sentence(s).
  sentence_to_control = new FormControl();
  sentence_from_control = new FormControl();
  //
  //Synonym(s) form control.
  synonym_word_control = new FormControl('mucii', Validators.required);
  synonym_meaning_control = new FormControl('handu ha guikara', Validators.required);
  synonym_sentence_control = new FormControl('', Validators.required);
  //
  //Language form control.
  language_one_control = new FormControl('Swahili', Validators.required);
  language_two_control = new FormControl('English', Validators.required);
  language_three_control = new FormControl('Gikuyu', Validators.required);
  //
  //Meaning form control.
  meaning_from_control = new FormControl('pahali pa kuishi', Validators.required);
  meaning_to_control = new FormControl('a place to live in', Validators.required);
  //
  //Category form control.
  category_control = new FormControl('noun', Validators.required);
  //
  //The list of languages, from the database.
  languages?: Array<Language['data']>;
  //
  //The English catogories, provided for in the database.
  categories?: Array<Category['data']>;
  //
  //Compile the words to use to get the terms.
  words_for_terms: Array<string> = [];
  //
  //How long the snackbar shows.
  duration: number = 5;

  constructor(
    //
    //The language service.
    public language_service: LanguageService,
    //
    //The category service.
    public category_service: CategoryService,
    //
    //The service that checks if the translations are linked to  a term.
    private check_service: CheckService,
    //
    //The service that links words to their terms upon checking.
    private save_service: SaveService,
    //
    //The dialog box.
    public dialog: MatDialog,
    //
    //The snackbar.
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    //
    //Retrieve the list of languages from the database
    this.language_service.get_language().subscribe(
      //
      (response: any) => {
        //
        //Ensure we have some response.
        if(response.success === true){
          //
          //Get the data and save it globally.
          this.languages = response.data;
        }
      }
    );
    //
    //Retrieve the categories from the database.
    this.category_service.get_category().subscribe(
      //
      (response: any) => {
        //
        //Ensure we have some response.
        if(response.success === true){
          //
          //Get the data and save it globally.
          this.categories = response.data;
        }
      }
    );
  }
  //
  setStep(index: number) {
    this.step = index;
  }
  //
  //Navigate the user forward.
  nextStep() {
    //
    //Step one.
    if(this.step === 0){
      //
      //Ensure the user provides values, to proceed to the next step.
      if(
        this.language_one_control.value === '' || 
        this.translate_from_control.value === '' || 
        this.meaning_from_control.value === '' ||
        this.language_two_control.value === '' || 
        this.translate_to_control.value === '' || 
        this.meaning_to_control.value === '' ||
        this.category_control.value === ''
      ){
        //
        //Alert the user to fill in some required values.
        this.open_snackbar('Missing value(s)');
        //
        //Keep the user in the current step, to get some values from him/her.
        this.step = 0;
      }
      else{
        //
        //Save the word to add globally.
        this.words_for_terms.push(this.translate_from_control.value!);
        this.words_for_terms.push(this.translate_to_control.value!);
        //
        //Navigate the user to the next step.
        this.step++;
        //
        //Change the state of the expansion panel.
        this.is_disabled = false;
      }
    }
    else if(this.step === 1){
      //
      //Ensure the user provides values, to proceed to the next step.
      if(
        this.language_three_control.value === '' || 
        this.synonym_word_control.value === '' || 
        this.synonym_meaning_control.value === '' ||
        this.category_control.value === ''
      ){
        //
        //Get some response from the snackbar.
        const val = confirm("Proceed without synonyms?");
        //
        //Check the user's response.
        if(val === true){
          //
          //Pass the words that will use to get the terms to the dialog box
          this.openDialog(this.words_for_terms);
        }
        else{
          //
          //Ask the user to provide synonym.
          this.open_snackbar('Please provide a synonym');
        }
      }
      else{   
        //
        //Save the synonym globally.
        this.words_for_terms.push(this.synonym_word_control.value!);  
        //
        //Pass the words that will use to get the terms to the dialog box
        this.openDialog(this.words_for_terms);
      }
    }
  }
  //
  //Navigate the user to the previous step.
  prevStep() {
    //
    //Change the state of the expansion panels.
    this.is_disabled = true;
    //
    //Move to the previous step.
    this.step--;
  }
  //
  //Pop up the dialog box.
  openDialog(word: Array<string> | null): void {
    //
    const dialogRef: MatDialogRef<terms_dialog, any> = this.dialog.open(terms_dialog, {
      data: {word: word, category: this.categories},
    });
    //
    //Get data passed from the dialog after closing.
    dialogRef.afterClosed().subscribe(result => {
      //
      //Save the selected term globally.
      this.selected_term = result;
      //
      //Check if the word and the term are linked.
      this.check_and_save();
    });
  }
  //
  //Display the snackbar accordingly.
  open_snackbar(message: string) {
    //
    this._snackBar.openFromComponent(terms_snack_bar, {
      duration: this.duration * 1000,
      data: {msg: message}
    });
  }
  //
  //Check if the translations are linked to the chosen term
  check_and_save(): void{
    //
    //Compile content of the word to translate from.
    const translate_from: Word_for_term = {
      word: this.translate_from_control.value
    }
    //
    //Compile content of the word to translate to.
    const translate_to: Word_for_term = {
      word: this.translate_to_control.value
    }
    //
    //Compile content of the synonyms.
    const synonym: Word_for_term = {
      word: this.synonym_word_control.value
    }
    //
    //Compile the values.
    const values = {
      translate_from: translate_from,
      translate_to: translate_to,
      synonym: synonym,
      term: this.selected_term?.term
    }
    //
    //First check if the words are linked to the selected term.
    this.check_service.check(values).subscribe(
      //
      (response: any) => {
        //
        //First ensure we have a response from the database.
        if (response.success === true) {
          //
          //Save the response globally.
          const check_response: string = response.data;
          //
          //Save the new translations, if they are not linked to a term.
          this.save(check_response);
        }
        else{
          //
          //Let the user know the checking is unsuccessful.
          this.open_snackbar('Unable to check, try again');
        }
      }
    );
  }
  //
  //Save the translation in the database.
  save(check_response: string): void{
    //
    //Compile content of the word to translate from.
    const translation_from: Word_to_save['word_from'] = {
      language: this.language_one_control.value,
      word: this.translate_from_control.value,
      meaning: this.meaning_from_control.value,
      sentence: this.sentence_from_control.value,
    }
    //
    //Compile content of the word to translate to.
    const translation_to = {
      language: this.language_two_control.value,
      word: this.translate_to_control.value,
      meaning: this.meaning_to_control.value,
      sentence: this.sentence_to_control.value,
    }
    //
    //Compile content of the synonyms.
    const synonym = {
      language: this.language_three_control.value,
      word: this.synonym_word_control.value,
      meaning: this.synonym_meaning_control.value,
      sentence: this.synonym_sentence_control.value,
    }
    //
    //Compile the values.
    const values = {
      translation_from: translation_from,
      translation_to: translation_to,
      synonym: synonym,
      term: this.selected_term
    }
    //
    //Verify the results from checking the link between a word and a term.
    this.verify(check_response, values);
  }
  //
  //Verify the results from checking the link between a word and a term.
  verify(check_response: string, values: any){
    //
    //Loop through all the responses from checking and do the necessary action
    switch (check_response) {
      //
      case 'all':
        //
        //The translations already exist in the database, can't save them.
        this.open_snackbar('Translations already exist');   
        break;
      //
      case 'none':
        //
        //Save the translation_from, translation_to and synonym. Link them to the 
        //selected term.

        //
        this.open_snackbar('none');   
        break;
      //
      case 'translation_from':
        //
        //Save the translation_to and synonym in the database, link them with the 
        //selected term.

        //
        this.open_snackbar('translation_from');   
        break;
      //
      case 'translation_to':
        //
        //Save the translation_from and synonym in the database, link them with the 
        //selected term.

        //
        this.open_snackbar('translation_to');   
        break;
      //
      case 'synonym':
        //
        //Save the translation_from and translation_to in the database, link them with the 
        //selected term.

        //
        this.open_snackbar('synonym');   
        break;
      //
      case 'translation_from_to':
        //
        //Save the synonym in the database, link it with the selected term.
        
        //
        this.open_snackbar('translation_from_to');   
        break;
      //
      case 'translation_from_synonym':
        //
        //Save the translation_to in the database, link it with the selected term.
        
        //
        this.open_snackbar('translation_from_synonym');   
        break;
      //
      case 'translation_to_synonym':
        //
        //Save the translation_from in the database, link it with the selected term.
        this.save_service.save(values).subscribe(
          //
          response => {
            //
            console.log(response);
          }
        );
        //
        this.open_snackbar('translation_to_synonym');   
        break;
      //
      default:
        //
        //It is extremely hard to reach this point.
        //
        this.open_snackbar('Unreachable zone'); 
        break;
    }
   }
}