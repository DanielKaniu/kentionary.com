import { Injectable } from '@angular/core';
//
//Get access to the server api.
import { HttpClient } from '@angular/common/http';
import { Language } from 'src/types/types';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  //
  //The API URL.
  public url: string = 'http://localhost/kenny_final/api/data/';
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
        this.url + 'get_language.php',
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
