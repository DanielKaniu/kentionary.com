import { Component, ElementRef, ViewChild, Inject } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
//
@Component({
    selector: 'terms-snack',
    templateUrl: './terms_snackbar.html',
    styleUrls: ['./snackbar.css']
  })
  export class terms_snack_bar {
    //
    //Get the div element on which to attach the terms.
    @ViewChild('msg') msg!: ElementRef;
    //
    constructor(
      //
      //Refer to the snackbar class.
      public snackBarRef: MatSnackBarRef<terms_snack_bar>,
      //
      //The data passed from where this snackbar is called.
      @Inject(MAT_SNACK_BAR_DATA) public data: any,
    ){
  
    }
    //
    //Get the terms after initializing the view.
    ngAfterViewInit(): void {
      //
      //Get the terms associated with the word provided by the user.
      this.show_snackbar();
    }
    //
    //Display the snackbar.
    show_snackbar(){
      //
      //Attach the data to the snackbar.
      this.msg.nativeElement.innerHTML = this.data.msg;
    }
    //
    //The user knows some synonyms.
    yes_synonym(): void{
      //
    }
    //
    //The user knows no synonyms.
    no_synonym():void{

    }
  }