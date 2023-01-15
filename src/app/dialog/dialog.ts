//

import { Component, ElementRef, ViewChild, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TermService } from "src/services/term.service";
import { Category, New_term, Term } from "src/types/types";
import { terms_snack_bar } from "../snackbar/snackbar";

//The dialog for terms.
@Component({
    selector: 'terms_dialog',
    templateUrl: './terms_dialog.html',
    styleUrls: ['./terms_dialog.css']
  })
  //
  export class terms_dialog {
    //
    //Get the div element on which to attach the terms.
    @ViewChild('divTerms') div_terms!: ElementRef;
    //
    //Show/hide the create new term elements.
    is_hidden: boolean = true;
    //
    //The form controls.
    term_control = new FormControl('', Validators.required);
    category_control = new FormControl('', Validators.required);
    //
    //The terms.
    terms?: Array<Term['data']>;
    //
    //The term for which the user wants to add a translation.
    selected_term?: New_term;
    //
    //The term the user creates when s/he doesn't find a term of choice.
    new_term?: New_term;
    //
    //The English catogories, provided for in the database.
    categories?: Array<Category['data']>;
    //
    //How long the snackbar shows.
    duration: number = 5;
    //
    constructor(
      //
      //The terms service.
      private term_service: TermService,
      //
      //The dialog class.
      public dialogRef: MatDialogRef<terms_dialog>,
      //
      //The data passed from where this dialog is called.
      @Inject(MAT_DIALOG_DATA) public data: any,
      //
      //The snackbar.
      private _snackBar: MatSnackBar
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
        //Compile the term object.
        const term_object = {
            term: datum.object,
            category: datum.category,
            new_term: false
        }
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
          this.selected_term = term_object;
        } )
        //
        //Attach some values to the elements.
        label.innerText = term;
        label.prepend(radio);
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
    }
    //
    //Get the values of the newly created term.
    get_new_term(): void{
      //
      //Ensure the user provides values, not to create empty term.
      if(
        this.term_control.value === '' ||
        this.category_control.value === ''
      ){
        //
        //Alert the user.
        this.open_snackbar('Missing value(s)');
      }
      else{
        //
        //Get the values.
        const term: New_term = {
          term: this.term_control.value,
          category: this.category_control.value,
          new_term: true
        }
        //
        this.dialogRef.close(term);
      }
    }
    //
    //Show the terms panel.
    hide():void{
      //
      //Show the panel for creating a new term
      this.is_hidden = true;
    }
    //
    //Display the snackbar accordingly.
    open_snackbar(message: string) {
      this._snackBar.openFromComponent(terms_snack_bar, {
        duration: this.duration * 1000,
        data: {msg: message}
      });
    }
  }