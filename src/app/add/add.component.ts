import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { CategoryService } from 'src/services/category.service';
import { LanguageService } from 'src/services/language.service';
import { Category, Language, Term, Word_for_term } from 'src/types/types';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TermService } from 'src/services/term.service';
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
  is_disabled?: boolean = true;
  //
  //Each step of an expansion panel.
  step = 0;
  //
  //The term/object the user wants to translate.
  selected_term?: string;
  //
  //The word(s) to translate.
  translate_from_control = new FormControl('', Validators.required);
  translate_to_control = new FormControl('', Validators.required);
  //
  //Example sentence(s).
  sentence_to_control = new FormControl();
  sentence_from_control = new FormControl();
  //
  //Synonym(s) form control.
  synonym_word_control = new FormControl('', Validators.required);
  synonym_meaning_control = new FormControl('', Validators.required);
  synonym_sentence_control = new FormControl('', Validators.required);
  //
  //Language form control.
  language_one_control = new FormControl<Language | ''>('', Validators.required);
  language_two_control = new FormControl<Language | ''>('', Validators.required);
  language_three_control = new FormControl<Language | ''>('', Validators.required);
  //
  //Meaning form control.
  meaning_from_control = new FormControl('', Validators.required);
  meaning_to_control = new FormControl('', Validators.required);
  //
  //Category form control.
  category_control = new FormControl<Category | ''>('', Validators.required);
  //
  //The list of languages, from the database.
  languages?: Array<Language['data']>;
  //
  //The English catogories, provided for in the database.
  categories?: Array<Category['data']>;
  //
  //Compile the words to use to get the terms.
  words_for_terms: Array<string> = [];

  constructor(
    //
    //The language service.
    private language_service: LanguageService,
    //
    //The category service.
    private category_service: CategoryService,
    //
    //The dialog box.
    public dialog: MatDialog
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
    this.openDialog(this.words_for_terms);
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
        alert('Missing value(s)');
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
        this.language_one_control.value === '' || 
        this.translate_from_control.value === '' || 
        this.meaning_from_control.value === '' ||
        this.language_two_control.value === '' || 
        this.translate_to_control.value === '' || 
        this.meaning_to_control.value === '' ||
        this.category_control.value === ''
      ){
        //
        //Confirm that the user knows not any synonyms for the words.
        alert("Are you sure you don't know any synonyms?");
      }
      else{        
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
    const dialogRef: MatDialogRef<terms, any> = this.dialog.open(terms, {
      data: {word: word, category: this.categories},
    });
    //
    //Get data passed from the dialog after closing.
    dialogRef.afterClosed().subscribe(result => {
      this.selected_term = result;
      console.log(this.selected_term);
    });
  }
}
//
//The dialog for terms.
@Component({
  selector: 'terms_dialog',
  templateUrl: 'terms_dialog.html',
  styleUrls: ['./terms_dialog.css']
})
//
export class terms {
  //
  //Get the div element on which to attach the terms.
  @ViewChild('divTerms') div_terms!: ElementRef;
  @ViewChild('newTerm') new_term!: ElementRef;
  //
  //Show/hide the create new term elements.
  is_hidden: boolean = true
  //
  //The form controls.
  term_control = new FormControl('', Validators.required);
  category_control = new FormControl('', Validators.required);
  //
  //The terms.
  terms?: Array<Term['data']>;
  //
  //The term for which the user wants to add a translation.
  selected_term?: string;
  //
  //The English catogories, provided for in the database.
  categories?: Array<Category['data']>;
  //
  constructor(
    //
    //The terms service.
    private term_service: TermService,
    //
    //The dialog class.
    public dialogRef: MatDialogRef<terms>,
    //
    //The data passed from where this dialog is called.
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  //
  //Get the terms after initializing the view.
  ngAfterViewInit(): void {
    //
    //Get the terms associated with the word provided by the user.
    this.get_terms();
  }
  //
  //Fetch the terms.
  get_terms(){
    //
    //Call the service responsible for sending the data to the database.
    this.term_service.get_term(this.data).subscribe(
      //
      (response: any) => {
        //
        //Ensure the fetching is successful.
        if(response.success === true){
          //
          //Save the terms globally.
          this.terms = response.data;
          //
          //Create radio buttons, on which to attach the terms.
          this.make_radios(); 
        }
      }
    )
  }
  //
  //Make radio buttons.
  make_radios(){
    //
    //Get the data from the response.
    this.terms!.forEach((datum: any) => {
      //
      //Compile the terms to attach to the label.
      const term = `${datum.object} (${datum.category})`;
      //
      //Create the elements that will hold the terms.
      const label = document.createElement('label');
      const radio = document.createElement('input');
      const line_break = document.createElement('br');
      //
      //Set attributes on the created elements.
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'terms');
      radio.addEventListener('click', () =>{
        //
        //Save the selected term globally.
        this.selected_term = datum.object;
      } )
      //
      //Attach some values to the elements.
      label.innerText = term;
      label.appendChild(radio);
      label.appendChild(line_break);
      //
      //Attach the elements to the parent element.
      this.div_terms.nativeElement.prepend(label);
    })
  }
  //
  //Get the selected term.
  get_selected_term(): void{
    //
    this.dialogRef.close(this.selected_term);
  }
  //
  //Create a new term since the user has not seen the term s/he is looking for.
  create_term(): void{
    //
    //Show the panel for creating a new term
    this.is_hidden = false;
    //
    //Save the categories passed from the parent to the dialog.
    this.categories = this.data.category;
    console.log(this.categories);
  }
}
