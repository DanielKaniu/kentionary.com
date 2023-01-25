import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
//The path to the server.
import { url } from './url';
//
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the user details and send them to Hallelujah Technologies.
  send_message(values: any){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'check/contact.php',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
