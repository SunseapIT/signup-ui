import { AuthguardGuard } from './../../authguard.guard';
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
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadModule } from 'ng2-file-upload';
import { UploadFactsheetComponent } from './add-plan/upload-factsheet/upload-factsheet.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { GrdFilterPipe } from './filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from './sidebar/sidebar.component'
import { SuccessfullSignupComponent } from './audit/successfull-signup/successfull-signup.component';
import { AbandonedSignupComponent } from './audit/abandoned-signup/abandoned-signup.component';


@NgModule({
  imports: [
    CommonModule,
    AdminLoginRoutingModule,
    FormsModule,
    Angular2CsvModule,
    ToastrModule.forRoot(),
    TabsModule,
    PdfViewerModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
  ],
  declarations: [AdminLoginComponent,
     AddPlanComponent, 
     AuditComponent, 
     AdminDashboardComponent,
     ViewPlanComponent, 
     UploadFactsheetComponent,
     GrdFilterPipe,
     SidebarComponent,
     SuccessfullSignupComponent,
     AbandonedSignupComponent, 
  
    ],

    providers: [
      AuthguardGuard
      ]
})
export class AdminModule { }
