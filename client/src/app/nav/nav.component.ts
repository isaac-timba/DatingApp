import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AccountService} from '../_services/account.service';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgOptimizedImage, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    NgOptimizedImage
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  accountService: AccountService = inject(AccountService);
  model: any = {};
  private router: Router = inject(Router);
  private toasterService = inject(ToastrService)

  login() {
    this.accountService.login(this.model)
      .subscribe({
        next: res => {
          void this.router.navigateByUrl('/members');
        },
        error: err => this.toasterService.error(err.error)
      })
  }

  logout() {
    this.accountService.logout();
    void this.router.navigateByUrl('/');
  }
}
