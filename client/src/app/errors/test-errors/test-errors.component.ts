import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {

  baseUrl = 'http://localhost:5000/api/';
  private http: HttpClient = inject(HttpClient);
  validationErrors: string[] = [];

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request')
      .subscribe({
        next: res => console.log(res),
        error: err => console.log(err)
      })
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth')
      .subscribe({
        next: res => console.log(res),
        error: err => console.log(err)
      })
  }

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found')
      .subscribe({
        next: res => console.log(res),
        error: err => console.log(err)
      })
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error')
      .subscribe({
        next: res => console.log(res),
        error: err => console.log(err)
      })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {})
      .subscribe({
        next: res => console.log(res),
        error: err => {
          console.log(err)
          this.validationErrors = err;
        }
      })
  }
}
