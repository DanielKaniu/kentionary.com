import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/types/types';
//
//The path to the server.
import { url } from './url';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //
  constructor(
    //
    //Inject the http client module to use it to access the api.
    private http: HttpClient
  ) { }
  //
  //Get the list of categories from the database.
  get_category(){
    //
    return this.http.get<Array<Category>>(
        //
        //The API URL.
        url + 'add_word/get_category',
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
