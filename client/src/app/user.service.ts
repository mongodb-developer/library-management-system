import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import jwt_decode from "jwt-decode";
import { User } from './models/user';
import { URL } from './config';

interface JWTDecodeResult {
  name: string;
  sub: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null;

  constructor(private client: HttpClient) { }

  login(username?: string): Observable<User> {
    const loggedInUser = this.getLoggedInUser();
    if (loggedInUser) {
      return of(loggedInUser);
    }

    if (this.user) {
      return of(this.user);
    }

    let loginURL = `${URL}/users/login`;

    if (username) {
      loginURL += `/${username}`;
    }

    return this.client.get(loginURL)
      .pipe(
        map((result: any) => {
          this.setSession(result);

          if (!this.user) {
            throw new Error('Unable to login');
          }

          return this.user;
        })
      );
  }

  logout() {
    this.clearSession();
    this.user = null;
  }

  getLoggedInUser() {
    const token = localStorage.getItem('access_token');
    if (!token || this.isTokenExpired(token)) {
      this.clearSession();
      return null;
    }

    const decoded = jwt_decode(token) as JWTDecodeResult;
    this.setUser(decoded);

    return this.user;
  }

  private setSession(authResult: any) {
    const token = authResult.jwt;
    const decoded = jwt_decode(token) as JWTDecodeResult;

    localStorage.setItem('access_token', token);
    this.setUser(decoded);

    return this.user;
  }

  private setUser(decodedToken: JWTDecodeResult) {
    this.user = {
      _id: decodedToken?.sub,
      name: decodedToken?.name,
      isAdmin: !!decodedToken?.isAdmin
    };
  }

  private clearSession() {
    localStorage.removeItem('access_token');
  }

  private isTokenExpired(token: string) {
    if (!token) {
      return true;
    }

    const expires = (jwt_decode(token) as JWTDecodeResult)?.exp;
    if (!expires) {
      return true;
    }

    const now = new Date();
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(expires);

    return now > expirationDate;
  }
}
