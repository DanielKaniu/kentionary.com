import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  //
  //The path to the server.
  url: string = 'http://localhost/kentionary/api/translate/';
  constructor(
    private http: HttpClient
  ) { }
  //
  //Retrieve translations for the user-specified word.
  get_translation(word: string){
    //
    return this.http.post(
      this.url + 'translate.php',
      {word: word}
    );
  }
}
