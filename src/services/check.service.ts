import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Check } from 'src/types/types';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
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
  //Check if the translations are associated with a term.
  check(values: any){
    //
    return this.http.post<Check>(
        //
        //The API URL.
        this.url + 'check.php',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}