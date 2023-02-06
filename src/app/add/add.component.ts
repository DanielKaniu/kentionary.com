import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/services/category.service';
import { LanguageService } from 'src/services/language.service';
import {
  Category,
  Language,
  New_term,
  Selected_term,
  Word_for_term,
  Word_to_save,
} from 'src/types/types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { terms_snack_bar } from '../snackbar/snackbar';
import { terms_dialog } from '../dialog/dialog';
import { CheckService } from 'src/services/check.service';
import { SaveService } from 'src/services/save.service';
//
//To get the query parameters passed from the translate component.
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/services/image.service';
//
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
//
export class AddComponent implements OnInit {
  //
  //Show/hide the expansion panels.
  is_disabled?: boolean = true;
  //
  //Each step of an expansion panel.
  step = 0;
  //
  //The term/object the user wants to translate.
  selected_term?: Selected_term | New_term;
  //
  //The word(s) to translate.
  translate_from_control = new FormControl('', Validators.required);
  translate_to_control = new FormControl('', Validators.required);
  synonym_word_control = new FormControl('');
  //
  //Example sentence(s).
  sentence_to_control = new FormControl();
  sentence_from_control = new FormControl();
  synonym_sentence_control = new FormControl();
  //
  //Language form control.
  language_one_control = new FormControl('', Validators.required);
  language_two_control = new FormControl('', Validators.required);
  language_three_control = new FormControl('');
  //
  //Meaning form control.
  meaning_from_control = new FormControl('', Validators.required);
  meaning_to_control = new FormControl('', Validators.required);
  synonym_meaning_control = new FormControl('');
  //
  //Category form control.
  category_control = new FormControl('', Validators.required);
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
  //
  //The value to help know if the user has provided a synonym or not.
  synonym_state: boolean = false;
  //
  //The image which the user wants to upload.
  image?: string;
  //
  constructor(
    //
    //The language service.
    private language_service: LanguageService,
    //
    //The category service.
    private category_service: CategoryService,
    //
    //The service that checks if the translations are linked to  a term.
    private check_service: CheckService,
    //
    //The service that links words to their terms upon checking.
    private save_service: SaveService,
    //
    //This image service helps the user save an image in the database.
    private image_service: ImageService,
    //
    //The dialog box.
    private dialog: MatDialog,
    //
    //The snackbar.
    private _snackBar: MatSnackBar,
    //
    //To help get the query parameters on the current URL.
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    //
    //Get the query parameter.
    this.route.queryParams.subscribe(
      params => {
        //
        //Set the value of the word to translate from.
        this.translate_from_control.setValue(params['word']);
        //
        //Set the value of the language from.
        this.language_one_control.setValue(params['language_from']);
        //
        //Set the value of the language to.
        this.language_two_control.setValue(params['language_to']);
      }
    );
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
        if (response.success === true) {
          //
          //Get the data and save it globally.
          this.categories = response.data;
        }
      }
    );
  }
  //
  setStep(index: number): void {
    this.step = index;
  }
  //
  //Navigate the user forward.
  nextStep(): void {
    //
    //Step one.
    if (this.step === 0) {
      //
      //Ensure the user provides values, to proceed to the next step.
      if (
        this.language_one_control.value === '' ||
        this.translate_from_control.value === '' ||
        this.meaning_from_control.value === '' ||
        this.language_two_control.value === '' ||
        this.translate_to_control.value === '' ||
        this.meaning_to_control.value === '' ||
        this.category_control.value === ''
      ) {
        //
        //Alert the user to fill in some required values.
        this.open_snackbar('Missing value(s)');
        //
        //Keep the user in the current step, to get some values from him/her.
        this.step = 0;
      } else {
        //
        //Save the word to add globally.
        this.words_for_terms.push(this.translate_from_control.value!);
        this.words_for_terms.push(this.translate_to_control.value!);
        //
        //Navigate the user to the next step.
        this.step++;
        //
        //Encourage the user.
        this.open_snackbar('Almost there!');
        //
        //Change the state of the expansion panel.
        this.is_disabled = false;
      }
    } else if (this.step === 1) {
      //
      //Ensure the user provides values, to proceed to the next step.
      if (
        this.language_three_control.value === '' ||
        this.synonym_word_control.value === '' ||
        this.synonym_meaning_control.value === '' ||
        this.category_control.value === ''
      ) {
        //
        //Ask the user if s/he wants to save translation without synonyms.
        const val = confirm('Proceed without synonyms?');
        //
        //Check the user's response.
        if (val === true) {
          //
          //The user has not provided synonym values.
          this.synonym_state = false;
          //
          //Pass the words that will use to get the terms to the dialog box
          this.openDialog(this.words_for_terms);
        } else {
          console.log(this.words_for_terms);
          //
          //Ask the user to provide synonym.
          this.open_snackbar('Please provide a synonym');
        }
      } else {
        //
        //The user has provided synonym values.
        this.synonym_state = true;
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
  prevStep(): void {
    //
    //Change the state of the expansion panels.
    this.is_disabled = true;
    //
    //Move to the previous step.
    this.step--;
  }
  //
  //Check if the translations are linked to the chosen term
  check_and_save(): void {
    //
    let values;
    //
    //Compile content of the word to translate from.
    const translate_from: Word_for_term = {
      word: this.translate_from_control.value,
      language: this.language_one_control.value
    };
    //
    //Compile content of the word to translate to.
    const translate_to: Word_for_term = {
      word: this.translate_to_control.value,
      language: this.language_two_control.value
    };
    //
    //Compile content of the synonyms.
    const synonym: Word_for_term = {
      word: this.synonym_word_control.value,
      language: this.language_three_control.value
    };
    //
    //Check if the user has provided a synonym.
    if(this.synonym_state === true){
      //
      //Compile the values.
      values = {
        translate_from: translate_from,
        translate_to: translate_to,
        synonym: synonym,
        term: this.selected_term?.term
      };
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
          } else {
            //
            //Let the user know the checking is unsuccessful.
            this.open_snackbar('Unable to check, try again');
          }
        }
      );
    }
    else{
      //
      //Compile the values.
      values = {
        translate_from: translate_from,
        translate_to: translate_to,
        term: this.selected_term?.term,
      };
      //
      //First check if the words are linked to the selected term.
      this.check_service.check_no_synonym(values).subscribe(
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
          } else {
            //
            //Let the user know the checking is unsuccessful.
            this.open_snackbar('Unable to check, try again');
          }
        }
      );
    }
  }
  //
  //Save the translation in the database.
  save(check_response: string): void {
    //
    //Compile content of the word to translate from.
    const translation_from: Word_to_save['word_from'] = {
      language: this.language_one_control.value,
      word: this.translate_from_control.value,
      meaning: this.meaning_from_control.value,
      sentence: this.sentence_from_control.value,
    };
    //
    //Compile content of the word to translate to.
    const translation_to = {
      language: this.language_two_control.value,
      word: this.translate_to_control.value,
      meaning: this.meaning_to_control.value,
      sentence: this.sentence_to_control.value,
    };
    //
    //Compile content of the synonyms.
    const synonym = {
      language: this.language_three_control.value,
      word: this.synonym_word_control.value,
      meaning: this.synonym_meaning_control.value,
      sentence: this.synonym_sentence_control.value,
    };
    //
    //Compile the values.
    const values = {
      translation_from: translation_from,
      translation_to: translation_to,
      synonym: synonym,
      term: this.selected_term,
    };
    //
    //Verify the results from checking the link between a word and a term.
    this.verify(check_response, values);
  }
  //
  //Verify the results from checking the link between a word and a term.
  verify(check_response: string, values: any) {
    //
    //Check if the user has provided some synonyms.
    if (this.synonym_state === true) {
      //
      //Add the state of the synonyms to the values object with is to be passed to the server.
      values.synonym_state = true;
      //
      //Loop through all the responses from checking and do the necessary action
      switch (check_response) {
        //
        //The translations already exist in the database, can't save them.
        case 'none':
          //
          this.open_snackbar('Translation already exists. Try another 😇');
          break;
        //
        //Save the translation_from, translation_to and synonym. Link them to the
        //selected term.
        case 'all':
          //
          //Add a property to the values object.
          values.type = 'all';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        case 'translation_to_synonym':
          //
          //Add a property to the values object.
          values.type = 'translation_to_synonym';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        //Save the translation_from and synonym in the database, link them with the
        //selected term.
        case 'translation_from_synonym':
          //
          //Add a property to the values object.
          values.type = 'translation_from_synonym';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        //Save the translation_from and translation_to in the database, link them with the
        //selected term.
        case 'translation_from_to':
          //
          //Add a property to the values object.
          values.type = 'translation_from_to';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        case 'synonym':
          //
          //Add a property to the values object.
          values.type = 'synonym';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        case 'translation_to':
          //
          //Add a property to the values object.
          values.type = 'translation_to';
          //
          //Save the translation_to in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              } else {
                //
                //Display a message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          //
          break;
        //
        case 'translation_from':
          //
          //Add a property to the values object.
          values.type = 'translation_from';
          //
          //Save the translation_from in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          //
          break;
        //
        default:
          //
          //It is extremely hard to reach this point.
          this.open_snackbar('Hardly reachable zone');
          break;
      }
    } 
    //
    //At this point the user has not provided synonyms.
    else {
      //
      //At this point the user doesn't have synonyms.
      delete values.synonym;
      //
      //Add the state of the synonyms to the values object with is to be passed to the server.
      values.synonym_state = false;
      //
      //Loop through all the responses from checking and do the necessary action
      switch (check_response) {
        //
        //The translations already exist in the database, can't save them.
        case 'none':
          //
          this.open_snackbar('Translation already exists. Try another 😇');
          break;
        //
        //Save the translation_from and translation_to in the database, link them with the
        //selected term.
        case 'translation_from_to':
          //
          //Add a property to the values object.
          values.type = 'translation_from_to';
          //
          //Save the synonym in the database, link it with the selected term.
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          break;
        //
        //Save the translation_to in the database, link it with the selected term.
        case 'translation_to':
          //
          //Add a property to the values object.
          values.type = 'translation_to';
          //
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              } else {
                //
                //Display a message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          //
          break;
        //
        //Save the translation_from in the database, link it with the selected term.
        case 'translation_from':
          //
          //Add a property to the values object.
          values.type = 'translation_from';
          //
          this.save_service.save(values).subscribe(
            //
            //Get the server response.
            (response) => {
              //
              //Check if the execution to the server is successful.
              if (response.success === true) {
                //
                //Display a positive message.
                this.open_snackbar('Successfully saved. Good job! 👏');
              }
              //
              //Alert the user when unsuccessful.
              else {
                //
                //Display a negative message.
                this.open_snackbar('Saving translation failed! 😞');
              }
            }
          );
          //
          break;
        //
        default:
          //
          //It is extremely hard to reach this point.
          this.open_snackbar('Hardly reachable zone');
          break;
      }
    }
  }
  //
  //Save the new term in the database
  save_new_term(){
    //
    //Compile content of the word to translate from.
    const translation_from: Word_to_save['word_from'] = {
      language: this.language_one_control.value,
      word: this.translate_from_control.value,
      meaning: this.meaning_from_control.value,
      sentence: this.sentence_from_control.value,
    };
    //
    //Compile content of the word to translate to.
    const translation_to = {
      language: this.language_two_control.value,
      word: this.translate_to_control.value,
      meaning: this.meaning_to_control.value,
      sentence: this.sentence_to_control.value,
    };
    //
    //Compile content of the synonyms.
    const synonym = {
      language: this.language_three_control.value,
      word: this.synonym_word_control.value,
      meaning: this.synonym_meaning_control.value,
      sentence: this.synonym_sentence_control.value,
    };
    //
    //Compile the values.
    const values: any = {
      translation_from: translation_from,
      translation_to: translation_to,
      synonym: synonym,
      term: this.selected_term,
      image: this.image
    };
    //
    //Check if a user is adding a new synonym.
    //
    //If the user is not adding a new synonym the add the translation from, translation to and synonym.
    if (this.synonym_state === true) {
      //
      //Add the state of the synonyms to the values object with is to be passed to the server.
      values.synonym_state = true;
      //
      //Save the synonym in the database, link it with the selected term.
      this.save_service.save_new_term(values).subscribe(
        //
        //Get the server response.
        (response) => {
          //
          //Check if the execution to the server is successful.
          if (response.success === true) {
            //
            //Display a positive message.
            this.open_snackbar('Successfully saved. Good job! 👏');
          }
          //
          //Alert the user when unsuccessful.
          else {
            //
            //Display a negative message.
            this.open_snackbar('Saving translation failed! 😞');
          }
        }
      );
    }
    //
    //Otherwise add the translation from and translation to.
    else{
      //
      //At this point the user doesn't have synonyms.
      delete values.synonym;
      //
      //Add the state of the synonyms to the values object with is to be passed to the server.
      values.synonym_state = false;
      //
      //Save the synonym in the database, link it with the selected term.
      this.save_service.save_new_term(values).subscribe(
        //
        //Get the server response.
        (response) => {
          //
          //Check if the execution to the server is successful.
          if (response.success === true) {
            //
            //Display a positive message.
            this.open_snackbar('Successfully saved. Good job! 👏');
          }
          //
          //Alert the user when unsuccessful.
          else {
            //
            //Display a negative message.
            this.open_snackbar('Saving translation failed! 😞');
          }
        }
      );
    }
  }
  //
  //Help the user upload an image on the server.
  upload_image(evt: any) {
    //
    //Get the image attributes.
    const image: File = evt.target?.files[0];
    //
    //Lets web applications asynchronously read the contents of files (or raw data buffers) 
    //stored on the user's computer, using File or Blob objects to specify the file or data to read.
    const file_reader = new FileReader();
    //
    //Read the uploaded image as a binary string.
    file_reader.readAsBinaryString(image);
    //
    file_reader.onload = ((event: ProgressEvent<FileReader>) => {
      //
      //The content of the file.
      const content = event.target?.result as string;
      //
      //Save the image content online.
      this.image = content;
      //
      //Save the image on the server.
      // this.image_service.upload_content(content).subscribe();
    })
  }
  //
  //Pop up the dialog box.
  openDialog(word: Array<string> | null): void {
    //
    const dialogRef: MatDialogRef<terms_dialog, any> = this.dialog.open(
      terms_dialog,
      {
        data: { word: word, category: this.categories },
      }
    );
    //
    //Get data passed from the dialog after closing.
    dialogRef.afterClosed().subscribe((result) => {
      //
      //Save the selected term globally.
      this.selected_term = result;
      //
      //Check if the user is creating a new term or not.
      if(this.selected_term?.new_term === true){
        //
        //Save the new term in the database
        this.save_new_term();
      }
      else{
        //
        //Check if the word and the term are linked.
        this.check_and_save();
      }
    });
  }
  //
  //Display the snackbar accordingly.
  open_snackbar(message: string) {
    //
    this._snackBar.openFromComponent(terms_snack_bar, {
      duration: this.duration * 1000,
      data: { msg: message },
      panelClass: ['add_snackbar']
    });
  }
}
