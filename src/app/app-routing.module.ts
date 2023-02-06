import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//
//Components.
import { AboutComponent } from './about/about.component';
import { AddComponent } from './add/add.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SupportComponent } from './support/support.component';
import { TranslateComponent } from './translate/translate.component';
//
//The paths the app is to follow.
const routes: Routes = [
  { path: 'translate', title: 'Kentionary | Translate', component: TranslateComponent },
  { path: 'add', title: 'Kentionary | Add a new Translation', component: AddComponent },
  { path: 'contact', title: 'Kentionary | Contact Us', component: ContactComponent },
  { path: 'about', title: 'Kentionary | About Us', component: AboutComponent },
  { path: 'support', title: 'Kentionary | Provide Support', component: SupportComponent },
  { path: '',   redirectTo: '/translate', pathMatch: 'full' },
  { path: '**', title: 'Page not Found', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
