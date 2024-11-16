import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Member} from '../_models/member';
import {Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  members = signal<Member[]>([]);

  getMembers(): void {
    this.http.get<Member[]>(this.baseUrl + 'users')
      .pipe(tap(members => this.members.set(members)))
      .subscribe();
  }

  getMember(username: string): Observable<Member> {
    const member = this.members().find(x => x.username === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'users', member).pipe(
      tap(() => this.members.update(members => members.map(m => m.username === member.username ? member : m)))
    );
  }
}
