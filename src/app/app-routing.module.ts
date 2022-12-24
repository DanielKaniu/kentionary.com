import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TranslateComponent } from './translate/translate.component';

//
//The paths the app is to follow.
const routes: Routes = [
  { path: 'translate', title: 'Kentionary | Translate', component: TranslateComponent },
  { path: 'add', title: 'Add a new Translation', component: AddComponent },
  { path: '',   redirectTo: '/translate', pathMatch: 'full' },
  { path: '**', title: 'Page not Found', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
