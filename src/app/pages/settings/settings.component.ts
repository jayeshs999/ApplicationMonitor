import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  nodeForm = {
    ip: '',
    name: '',
    groups: []
  };
  listGroups: any[] = [];
  listNodes: any[] = [];

  groupForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  userForm = {
    username: '',
    password1: '',
    password2: '',
    groups: ''
  }

  databaseForm = {
    name: '',
    node: '',
  }
  constructor(private httpService: HttpServiceService, private router: Router) { }

  ngOnInit(): void {
    this.httpService.getOrRedirectToLogin(API.ServerURL + API.CheckLoginURL).subscribe({
      next: (res: any) => {
        if (res.user == 'admin') {
          this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetGroups).subscribe({
            next: (res: any) => {
              this.listGroups = res.data;
            }
          });

          this.httpService.get(API.ServerURL + API.GetNodes).subscribe({
            next: (res: any) => {
              this.listNodes = res.data;
            }
          })
        }
        else 
          this.router.navigate(['/pages']);
      }
    });
  }


  addNode() {
    this.httpService.postAndNotify(API.ServerURL + API.AddNode, this.nodeForm);
  }

  addGroup() {
    this.httpService.postAndNotify(API.ServerURL + API.AddGroup, this.groupForm);
  }

  addUser() {
    this.httpService.postAndNotify(API.ServerURL + API.AddUser, this.userForm);
  }

  addDatabase() {
    this.httpService.postAndNotify(API.ServerURL + API.AddDatabase, this.databaseForm);
  }

}
