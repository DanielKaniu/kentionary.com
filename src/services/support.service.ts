import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the list of categories from the database.
  handle_support(values: any){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'data/process_support.php',
        //
        //The payload data to send to the server.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
