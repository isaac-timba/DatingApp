import {Component, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {AccountService} from '../_services/account.service';
import {JsonPipe, NgClass, NgIf} from '@angular/common';
import {TextInputComponent} from '../_forms/text-input/text-input.component';
import {DatePickerComponent} from '../_forms/date-picker/date-picker.component';
import {catchError, EMPTY, tap} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgClass,
    NgIf,
    TextInputComponent,
    DatePickerComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  userFromHomeComponent: any = input.required();
  @Output() cancelRegister = new EventEmitter;
  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;

  private accountService: AccountService = inject(AccountService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true};
    }
  }

  register(): void {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dob});
    this.accountService.register(this.registerForm.getRawValue())
      .pipe(tap(() => {
            this.router.navigateByUrl('/members');
          }
        ),
        catchError(err => {
          this.validationErrors = err;
          return EMPTY;
        })
      )
      .subscribe();
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }
}
