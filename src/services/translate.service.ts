import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
//The path to the server.
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the list of categories from the database.
  get_translation(word: string | null, language: string | null){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'data/get_translation.php',
        //
        //The word to translate.
        {
          word: word, 
          language: language
        },
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
