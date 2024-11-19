import {Component, inject, Input, input, OnInit, Output, output} from '@angular/core';
import {Member} from '../../_models/member';
import {FileUploader, FileUploadModule} from 'ng2-file-upload';
import {DecimalPipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {AccountService} from '../../_services/account.service';
import {environment} from '../../../environments/environment';
import {MembersService} from '../../_services/members.service';
import {Photo} from '../../_models/photo';
import {tap} from 'rxjs';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [
    FileUploadModule,
    NgClass,
    NgIf,
    NgForOf,
    NgStyle,
    DecimalPipe
  ],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {

  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  baseUrl: string = environment.apiUrl;
  memberChange = output<Member>();

  private accountService: AccountService = inject(AccountService);
  private memberService: MembersService = inject(MembersService);

  ngOnInit(): void {
    this.initializeUploader();
  }


  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo)
      .pipe(tap(() => {
        const updatedMember = {...this.member()};
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id);
        this.memberChange.emit(updatedMember);
      }))
      .subscribe()
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo)
      .pipe(tap(() => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.currentUser.set(user);
        }
        const updatedMember = {...this.member()}
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => p.isMain = p.id === photo.id);
        this.memberChange.emit(updatedMember);
        }))
      .subscribe();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => file.withCredentials = false;

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = {...this.member()}
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
    };
  }
}
