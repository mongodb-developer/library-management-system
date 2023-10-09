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
import { reservationsResolver } from './reservations.resolver';
import { isAdminGuard } from './is-admin.guard';
import { userReservationsResolver } from './user-reservations.resolver';
import { userBorrowedBooksResolver } from './user-borrowed-books.resolver';
import { AuthorComponent } from './author/author.component';
import { authorResolver } from './author.resolver';

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
    resolve: {
      user: userResolver,
      reservations: userReservationsResolver,
      borrowedBooks: userBorrowedBooksResolver,
    },
  },
  {
    path: 'books/:isbn',
    component: BookComponent,
    resolve: {
      book: bookResolver,
      reservations: reservationsResolver,
    },
  },
  {
    path: 'authors/:id',
    component: AuthorComponent,
    resolve: {
      author: authorResolver
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canMatch: [isAdminGuard],
  },
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
