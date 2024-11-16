import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {Member} from '../../_models/member';
import {AccountService} from '../../_services/account.service';
import {tap} from 'rxjs';
import {MembersService} from '../../_services/members.service';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {FormsModule, NgForm} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    TabsModule,
    FormsModule
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  member?: Member;
  private accountService: AccountService = inject(AccountService);
  private memberService: MembersService = inject(MembersService);
  private toastService: ToastrService = inject(ToastrService);

  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username)
      .pipe(tap(member => this.member = member))
      .subscribe();
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value)
      .pipe(tap(_ => {
        this.toastService.success('Member updated');
        this.editForm?.reset(this.member);
      }))
      .subscribe();
  }

}
