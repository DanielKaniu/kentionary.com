import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
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
  //Get the list of categories from the database.
  get_translation(word: string | null){
    //
    return this.http.post(
        //
        //The API URL.
        this.url + 'get_translation.php',
        //
        //The word to translate.
        {word: word},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
