import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  nodeform = new FormGroup({
    IP: new FormControl(''),
    Name: new FormControl(''),
  });

  groupform = new FormGroup({
    Name: new FormControl(''),
    Description: new FormControl(''),
  });

  userform = new FormGroup({
    username: new FormControl(''),
    password1: new FormControl(''),
    password2: new FormControl(''),
    group_name: new FormControl('')
  })
  constructor() { }

  ngOnInit(): void {
  }

}
