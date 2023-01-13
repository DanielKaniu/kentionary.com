import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Check, Save_result } from 'src/types/types';
//
@Injectable({
  providedIn: 'root'
})
//
export class SaveService {
  //
  //The API URL.
  public url: string = 'http://localhost/kenny_final/api/save/';
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Save the translationsand link them with their respective terms.
  save(values: any){
    //
    return this.http.post<Save_result>(
        //
        //The API URL.
        this.url + 'save.php',
        //
        //The request body.
        {values: values},
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
