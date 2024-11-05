import {Component, EventEmitter, inject, input, Output, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AccountService} from '../_services/account.service';
import {catchError, EMPTY, tap} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userFromHomeComponent: any = input.required();
  @Output() cancelRegister = new EventEmitter;
  model: any = {};
  private accountService: AccountService = inject(AccountService);
  private toasterService: ToastrService = inject(ToastrService);

  register(): void {
    this.accountService.register(this.model)
      .pipe(tap(() => {
            this.cancel();
          }
        ),
        catchError(err => {
          this.toasterService.error(err.error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
