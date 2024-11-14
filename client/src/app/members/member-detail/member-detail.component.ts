import {Component, inject, OnInit} from '@angular/core';
import {MembersService} from '../../_services/members.service';
import {ActivatedRoute} from '@angular/router';
import {Member} from '../../_models/member';
import {EMPTY, of, switchMap, tap} from 'rxjs';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {GalleryComponent, GalleryItem, ImageItem} from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {

  private memberService: MembersService = inject(MembersService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  member?: Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.route.params
      .pipe(
        switchMap(params => params['username'] ? of(params['username']) : EMPTY),
        switchMap(username => this.memberService.getMember(username)),
        tap(member => {
          this.member = member as Member;
          member.photos.map(photo => this.images.push(new ImageItem({src: photo.url, thumb: photo.url})));
        })
      )
      .subscribe();
  }
}
