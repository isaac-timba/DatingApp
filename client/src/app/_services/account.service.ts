import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl: string = environment.apiUrl;
  currentUser = signal<User | null>(null);
  private http: HttpClient = inject(HttpClient);

  register(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/register', model)
      .pipe(tap(
        user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser.set(user);
          }
        }
      ));
  }

  login(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/login', model)
      .pipe(tap(
        user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser.set(user);
          }
        }
      ));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
