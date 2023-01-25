import { Injectable } from '@angular/core';
//
//Get access to the server api.
import { HttpClient } from '@angular/common/http';
import { Language } from 'src/types/types';
//
//The path to the server.
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the list of languages from the database.
  get_language(){
    //
    return this.http.get<Array<Language>>(
        //
        //The API URL.
        url + 'data/get_language.php',
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
