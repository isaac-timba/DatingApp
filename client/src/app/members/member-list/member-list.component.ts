import {Component, inject, OnInit} from '@angular/core';
import {MembersService} from '../../_services/members.service';
import {tap} from 'rxjs';
import {Member} from '../../_models/member';
import {MemberCardComponent} from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    MemberCardComponent
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  private memberService: MembersService = inject(MembersService);
  members: Member[] = [];
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMembers()
      .pipe(tap(
        members => this.members = members
      ))
      .subscribe();
  }

}
