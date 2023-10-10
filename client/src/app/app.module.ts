import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { BooksCatalogueComponent } from './books-catalogue/books-catalogue.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HeaderComponent } from './header/header.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ProfileComponent } from './profile/profile.component';
import { BookComponent } from './book/book.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CountDownComponent } from './count-down/count-down.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReviewComponent } from './review/review.component';
import { MatTableModule } from '@angular/material/table';
import { URL } from './config';
import { AuthorComponent } from './author/author.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const allowedDomain = URL.replace(/.*?\:\/\//, "").split(/[\/?]/)[0];

@NgModule({
  declarations: [
    AppComponent,
    BooksCatalogueComponent,
    SearchBarComponent,
    HeaderComponent,
    ProfileComponent,
    BookComponent,
    NotFoundComponent,
    CountDownComponent,
    ReviewFormComponent,
    StarRatingComponent,
    ReviewComponent,
    AuthorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [allowedDomain]
      },
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
