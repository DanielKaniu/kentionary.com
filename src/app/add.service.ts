import { Injectable } from '@angular/core';
import { AddModule } from './add/add.module';

@Injectable({
  providedIn: AddModule
})
export class AddService {

  constructor() { }
}
