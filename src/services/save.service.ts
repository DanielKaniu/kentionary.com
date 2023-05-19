import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Check, Save_result } from 'src/types/types';
//
//The path to the server.
import { url } from './url';
//
@Injectable({
  providedIn: 'root'
})
//
export class SaveService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Save the translationsand link them with their respective terms.
  save(values: any){
    //
    return this.http.post<Save_result>(
        //
        //The API URL.
        url + 'add_word/get_request',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
  //
  //Save the translationsand link them with their respective terms.
  save_new_term(values: any){
    //
    return this.http.post<Save_result>(
        //
        //The API URL.
        url + 'add_word/get_request',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
