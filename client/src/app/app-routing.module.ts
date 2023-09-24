import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';
import { ProfileComponent } from './profile/profile.component';
import { isAuthenticatedGuard } from './is-authenticated.guard';
import { canLoadProfileGuard } from './can-load-profile.guard';
import { userResolver } from './user.resolver';
import { BookComponent } from './book/book.component';
import { bookResolver } from './book.resolver';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: 'catalogue',
    component: BooksCatalogueComponent,
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
    canActivate: [
      isAuthenticatedGuard,
      canLoadProfileGuard,
    ],
    resolve: { user: userResolver },
  },
  {
    path: 'book/:id',
    component: BookComponent,
    resolve: { book: bookResolver },
  },
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
