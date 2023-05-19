import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Check } from 'src/types/types';
//
//The path to the server.
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Check if the translations are associated with a term.
  check(values: any){
    //
    return this.http.post<Check>(
        //
        //The API URL.
        url + 'check/get_request',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
  //
  //Check if the translations are associated with a term.
  //
  //In this case the user has not provided a synonym.
  check_no_synonym(values: any){
    //
    return this.http.post<Check>(
        //
        //The API URL.
        url + 'check/get_request_no_synonym',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
  //
  //Check if the translations are associated with a term.
  //
  //In this case the user has not provided a synonym.
  check_term_no_synonym(values: any){
    //
    return this.http.post<Check>(
        //
        //The API URL.
        url + 'check/get_request_term_no_synonym',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}