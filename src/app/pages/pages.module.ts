import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';

import { HeaderComponent } from './header/header.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { ChartsModule } from '../charts/charts.module';
import { AlertsComponent } from './alerts/alerts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    SettingsComponent,
    HeaderComponent,
    DashboardViewComponent,
    AlertsComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgApexchartsModule,
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzFormModule,
    NzAvatarModule,
    NzIconModule,
    NzDividerModule,
    NzListModule,
    NzCardModule,
    NzGridModule,
    ChartsModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
    NzEmptyModule,
    NzTableModule,
  ]
})
export class PagesModule { }
