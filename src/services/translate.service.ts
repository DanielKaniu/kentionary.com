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
  //Get the translation from the database.
  get_translation(word: string | null, language: string | null){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'translate/get_translation',
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
  //
  //Get the filtered translation, with both language_from + language_to, from the database.
  get_translation_filter(word: string | null, language_from: string | null, language_to: string | null){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'translate/get_translation_filter',
        //
        //The word to translate.
        {
          word: word, 
          language_from: language_from,
          language_to: language_to
        },
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
