import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { API } from 'src/app/API';
import { HttpServiceService } from 'src/app/http-service.service';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  confirmDeleteModal?: NzModalRef;

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
    groups: []
  }

  databaseForm = {
    name: '',
    node: '',
    description: ''
  }

  nodeData : any[] = [];
  groupData : any[] = [];
  databaseData : any[] = [];
  userData : any[] = [];

  constructor(private httpService: HttpServiceService, private router: Router, private modal: NzModalService,  private notification : NzNotificationService) { }

  ngOnInit(): void {
    this.httpService.getOrRedirectToLogin(API.ServerURL + API.CheckLoginURL).subscribe({
      next: (res: any) => {
        if (res.user == 'admin') {
          this.httpService.getOrRedirectToLogin(API.ServerURL + API.GetGroups).subscribe({
            next: (res: any) => {
              console.log(res);
              this.listGroups = res.data.map((ele)=>ele.name);
            }
          });

          this.httpService.get(API.ServerURL + API.GetNodes).subscribe({
            next: (res: any) => {
              this.listNodes = res.data.map((ele)=>ele.ip);
            }
          })

          this.syncDatabase();
          this.syncGroup();
          this.syncNode();
          this.syncUser();
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
    this.httpService.postAndNotify(API.ServerURL + API.AddGroup, this.groupForm.value);
  }

  addUser() {
    this.httpService.postAndNotify(API.ServerURL + API.AddUser, this.userForm);
  }

  addDatabase() {
    this.httpService.postAndNotify(API.ServerURL + API.AddDatabase, this.databaseForm);
  }

  syncNode(){
    this.httpService.get(API.ServerURL + API.GetNodes).subscribe({
      next: (res: any) => {
        this.nodeData = res.data;
      }
    })
  }

  syncGroup(){
    this.httpService.get(API.ServerURL + API.GetGroups).subscribe({
      next: (res: any) => {
        this.groupData = res.data;
      }
    });
  }

  syncDatabase(){
    this.httpService.get(API.ServerURL + API.GetNodesAndDatabases).subscribe({
      next: (res : any) => {
        this.databaseData = res.data;
      }
    });
  }

  syncUser(){
    this.httpService.get(API.ServerURL + API.GetUsers).subscribe({
      next: (res : any) => {
        console.log(res.data)
        this.userData = res.data;
      }
    });
  }

  deleteNode(ip){
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle : 'Do you want to delete this node?',
      nzContent : '',
      nzOnOk :  () =>{
        this.httpService.post(API.ServerURL + API.DeleteNode, {
          ip : ip
        }).subscribe({ 
          next: (res:any) => {
            this.notification.success('Success',res.message);
            this.syncNode();
          },
          error: (err) => {
            this.notification.error('Error',err.error.err);
          }
        })
      }
    }
    )
  }

  deleteUser(username){
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle : 'Do you want to delete this user?',
      nzContent : '',
      nzOnOk :  () =>{
        this.httpService.post(API.ServerURL + API.DeleteUser, {
          username : username
        }).subscribe({ 
          next: (res:any) => {
            this.notification.success('Success',res.message);
            this.syncUser();
          },
          error: (err) => {
            this.notification.error('Error',err.error.err);
          }
        })
      }
    })
  }

  deleteGroup(name){
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle : 'Do you want to delete this group?',
      nzContent : '',
      nzOnOk :  () =>{
        this.httpService.post(API.ServerURL + API.DeleteGroup, {
          name : name
        }).subscribe({ 
          next: (res:any) => {
            this.notification.success('Success',res.message);
            this.syncGroup();
          },
          error: (err) => {
            this.notification.error('Error',err.error.err);
          }
        })
      }
    })
  }

  deleteDatabase(database_id){
    this.confirmDeleteModal = this.modal.confirm({
      nzTitle : 'Do you want to delete this database?',
      nzContent : '',
      nzOnOk :  () =>{
        this.httpService.post(API.ServerURL + API.DeleteDatabase, {
          database_id : database_id
        }).subscribe({ 
          next: (res:any) => {
            this.notification.success('Success',res.message);
            this.syncDatabase();
          },
          error: (err) => {
            this.notification.error('Error',err.error.err);
          }
        })
      }
    })
  }


}
