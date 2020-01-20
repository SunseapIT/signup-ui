
import { DotsLoaderComponent } from './dots-loader/dots-loader.component';
import { InputTrimModule } from 'ng2-trim-directive';
import { AuthguardGuard } from './../../authguard.guard';
import { FormsModule } from '@angular/forms';
import { AdminLoginRoutingModule } from './admin-login-routing.module';
import { NgModule, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule, DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule, MomentDateTimeAdapter } from "ng-pick-datetime-moment"
import { GrdFilterPipe } from './filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from './sidebar/sidebar.component'
import { SuccessfullSignupComponent } from './audit/successfull-signup/successfull-signup.component';
import { AbandonedSignupComponent } from './audit/abandoned-signup/abandoned-signup.component';

import { ApproveComponent } from './approve/approve.component';
import { ORDER_COMPONENTS } from '../order';
import { SharedModule } from '@app/shared';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { AddPromocodeComponent } from './promo-code/add-promocode/add-promocode.component';
import { ViewPromocodeComponent } from './promo-code/view-promocode/view-promocode.component';
export const MY_CUSTOM_FORMATS = {
  datePickerInput: 'DD/MM/YYYY HH:mm',
  monthYearLabel: 'MMM YYYY',
  timePickerInput: 'hh:mm A',
  parseInput: 'DD/MM/YYYY hh:mm A',
  fullPickerInput: 'DD/MM/YYYY hh:mm A',
  dateA11yLabel: 'L',
  monthYearA11yLabel: 'MM YYYY',
  };



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
    OwlMomentDateTimeModule,
    NgxPaginationModule,
    SharedModule, 
    InputTrimModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot() ,
    PaginationModule.forRoot(),
  ],
  declarations: [AdminLoginComponent,
     AddPlanComponent, 
     AuditComponent, 
     AdminDashboardComponent,
     ViewPlanComponent, 
     GrdFilterPipe,
     SidebarComponent,
     SuccessfullSignupComponent,
     AbandonedSignupComponent,
    
     ApproveComponent,
     PromoCodeComponent,
     AddPromocodeComponent,
     ViewPromocodeComponent,
     DotsLoaderComponent
    ],    
    providers: [
      AuthguardGuard,
      DatePipe,
      ORDER_COMPONENTS,
      { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
{ provide: OWL_DATE_TIME_LOCALE, useValue: 'en-nz' }
      ]
})

export class AdminModule { }
