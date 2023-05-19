import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class AutoSuggestService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the list of categories from the database.
  auto_suggest(letter: string, language: string){
    //
    return this.http.post(
        //
        //The API URL.
        url + 'translate/auto_suggest',
        //
        //The payload data.
        {
          letter: letter,
          language: language
        },
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
