import {Component, inject, OnInit} from '@angular/core';
import {RegisterComponent} from '../register/register.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RegisterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  users: any;
  registerMode: boolean = false;
  private http: HttpClient = inject(HttpClient);

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers() {
    this.http.get('http://localhost:5000/api/users')
      .subscribe({
        next: response => {
          this.users = response
          console.log('users: ', this.users);
        },
        error: err => console.log(err),
        complete: () => console.log('Request has completed')
      });
  }

  cancelHandler(event: boolean) {
    this.registerMode = event;
  }
}
