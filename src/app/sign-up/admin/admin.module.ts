import { FormsModule } from '@angular/forms';
import { AdminLoginRoutingModule } from './admin-login-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { AuditComponent } from './audit/audit.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { Angular2CsvModule } from 'angular2-csv';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FileUploadModule } from 'ng2-file-upload';
import { UploadFactsheetComponent } from './add-plan/upload-factsheet/upload-factsheet.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { GrdFilterPipe } from './filter';
import { NgxPaginationModule } from 'ngx-pagination'


@NgModule({
  imports: [
    CommonModule,
    AdminLoginRoutingModule,
    FormsModule,
    Angular2CsvModule,
    ToastrModule.forRoot(),
    TabsModule,
    PdfViewerModule,
    Ng2SmartTableModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule
    
  
  ],
  declarations: [AdminLoginComponent,
     AddPlanComponent, 
     AuditComponent, 
     AdminDashboardComponent,
     ViewPlanComponent, 
     UploadFactsheetComponent,
     GrdFilterPipe, 
    ]
})
export class AdminModule { }
