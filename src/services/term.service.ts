import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Term, Word_for_term } from 'src/types/types';

@Injectable({
  providedIn: 'root'
})
export class TermService {
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
  get_term(word: Array<Word_for_term>){
    //
    return this.http.post<Term>(
        //
        //The API URL.
        this.url + 'get_term.php',
        //
        //The request body
        {word: word},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
