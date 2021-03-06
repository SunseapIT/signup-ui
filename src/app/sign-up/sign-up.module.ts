import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2CsvModule } from 'angular2-csv';
import { BsDatepickerModule, PopoverModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
 import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { InputTrimModule } from 'ng2-trim-directive';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { ORDER_COMPONENTS } from './order';
import { SignUpComponent } from './sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-pagination-bootstrap';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SafeHtmlPipe } from '@app/shared/pipes/html.pipe';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    FileUploadModule,
    // RecaptchaModule.forRoot(),
    PopoverModule.forRoot(),
    PdfViewerModule,
    SignUpRoutingModule,
    NgxPaginationModule,
    PaginationModule,
    CoreModule,
    NgxCaptchaModule,
    // RecaptchaModule,
    SharedModule,
    Angular2CsvModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    PdfViewerModule,
    InputTrimModule,
    ModalModule.forRoot(),
    NgxCaptchaModule,
    RecaptchaV3Module

  ],
  declarations: [
    SignUpComponent,
    ORDER_COMPONENTS,
    SafeHtmlPipe
  ],
  providers: [
    DatePipe,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      // provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.reCaptchaSiteKey, size: 'invisible' } 
      // as RecaptchaSettings,
    }
  ],
  bootstrap: [SignUpComponent]
})
export class SignUpModule {
  constructor() {
  }
}

