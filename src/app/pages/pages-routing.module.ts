import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './alerts/alerts.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SettingsComponent } from './settings/settings.component';

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
        path : 'settings',
        component : SettingsComponent,
      },
      {
        path : 'alerts',
        component : AlertsComponent
      },
      {
        path : '**',
        redirectTo : 'dashboard',
      },
      {
        path : 'dashboard',
        component : DashboardViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
