import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from 'src/types/types';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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
  get_category(){
    //
    return this.http.get<Array<Category>>(
        //
        //The API URL.
        this.url + 'get_category.php',
        //
        //Specifies the format in which to return data.
        {responseType: 'json'}
      );
  }
}
