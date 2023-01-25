import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/services/contact.service';
import { terms_snack_bar } from '../snackbar/snackbar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  email_control = new FormControl('', Validators.required);
  subject_control = new FormControl('', Validators.required);
  message_control = new FormControl('', Validators.required);

  constructor(
    //
    //Contact service.
    private contact_service: ContactService,
    //
    //The snackbar.
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {}
  //
  //Allow the user to message us.
  send_message(): void{
    //
    //Ensure the user doesn't send a blank message.
    //
    //At this point the user has not provided full details.
    if (
      this.email_control.value === '' ||
      this.subject_control.value === '' ||
      this.message_control.value === ''
    ) {
      //
      //Alert the user.
      this.open_snackbar('Missing value(s)')
    } 
    //
    //At this point, we have the full details provided by the user.
    else {
      //
      //Compile the details provided by the user.
      const details = {
        email: this.email_control.value,
        subject: this.subject_control.value,
        message: this.message_control.value
      }
      //
      //Send the details to the server.
      this.contact_service.send_message(details).subscribe(
        //
        //Get the response.
        (response: any) => {
          //
          //Check the state of the response and display a message to the user.
          if(response.success === true){
            //
            //Positive message.
            this.open_snackbar('Success');
          }
          else{
            //
            //Negative message.
            this.open_snackbar('Failed');
          }
        }
      );
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
