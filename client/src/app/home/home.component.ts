import {Component} from '@angular/core';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RegisterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  users: any;
  registerMode: boolean = false;

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelHandler(event: boolean) {
    this.registerMode = event;
  }
}
