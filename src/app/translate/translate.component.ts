import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { TranslateService } from 'src/services/translate.service';
import { Translation } from 'src/types/types';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {
  //
  //
  @ViewChild('translation_display') translation_display!: ElementRef;
  //
  //The word to translate.
  word_control = new FormControl('mucii', Validators.required);
  //
  //The translation  response from the server.
  translations?: any;

  constructor(
    //
    //The service that translates.
    private translate_service: TranslateService
  ) { }

  ngOnInit(): void {
  }
  //
  //Get the translation.
  translate(){
    //
    //Get the word to translate.
    const word: string | null = this.word_control.value;
    //
    //Send the word to translate to the server.
    this.translate_service.get_translation(word).subscribe(
      //
      (response: any) => {
        //
        this.translations = response;
        //
        console.log(this.translations!.data);
        //
        //Paint the translation on its panel.
        // this.show_translation();
      }
    );
  }
  //
  //Display the translation.
  // show_translation(){
  //   this.translation_display.nativeElement.innerHTML = this.translations!.data;
  // }
}
