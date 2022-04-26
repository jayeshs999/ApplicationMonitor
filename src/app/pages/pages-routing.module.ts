import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  { 
    path: '', 
    component : PagesComponent,
    children : [
      {
        path : '',
        redirectTo : 'dashboard',
      },
      {
        path : 'dashboard',
        component : DashboardComponent,
      },
      {
        path : '**',
        redirectTo : 'dashboard',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
