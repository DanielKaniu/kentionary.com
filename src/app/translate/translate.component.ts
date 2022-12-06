import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../translate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {

  @ViewChild('word') clear_input?: ElementRef;
  //
  //The word to translate.
  word?: string;
  //
  category?: string;
  //
  language?: string;
  //
  compilation: any;
  //
  //The collection of translations.
  translation: any = [];

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.translate();
  }
  //
  //Translate the provided word.
  translate(): void{
    //
    this.word = this.clear_input?.nativeElement.value;
    //
    if (this.clear_input?.nativeElement.value !== '') {
      //
      this.translateService.get_translation(this.word!).subscribe(
        //
        (result: any) => {
          //
          const data = result.data;
          //
          this.category = result.data[0].category;
          //
          data.forEach((datum: any) => {
            //
            this.language = datum.language;
            //
            this.category = datum.category;
            //
            const definition = datum.definition;
            //
            const cleanDatum  = String(datum.translation).replace(/[\[\]']+/g,'').replace(/['"]+/g, '');
            ;
            //
            console.log(cleanDatum);
            //
            const compilation = {
              language: this.language,
              category: this.category,
              meaning: definition,
              translation: `${cleanDatum}`
            }
            //
            this.translation.push(compilation);
          })
        }
      );
    }
  }
  //
  //Navigate the user to the page for adding a new translation.
  addTranslation(){
    //
    this.router.navigateByUrl('/translate-form');
  }
}
