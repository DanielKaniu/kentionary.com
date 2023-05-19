import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupportService } from 'src/services/support.service';
//
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  //
  //The collective support form group.
  support_group = new FormGroup({
    amount: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });
  constructor(
    //
    //The service that processes the support received from the user.
    private support_service: SupportService
  ) { }

  ngOnInit(): void {
  }
  //
  //Handle the support offered by the user.
  process_support(){
    //
    //Call the service that communicates with the server.
    this.support_service.handle_support(this.support_group.getRawValue()).subscribe(
      //
      //Process the server response.
      (response: any)=> {
        //
        
      }
    );
  }
}