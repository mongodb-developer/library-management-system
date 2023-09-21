import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';

const routes: Routes = [
  {
    path: 'catalogue',
    component: BooksCatalogueComponent,
  },
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
