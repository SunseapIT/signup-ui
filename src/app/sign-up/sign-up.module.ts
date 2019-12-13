import { LOADER_COMPONENTS } from './loader/index';

import { PAYMENT_COMPONENTS } from './tokenization/index';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2CsvModule } from 'angular2-csv';
import { BsDatepickerModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { SignUpRoutingModule } from './sign-up-routing.module';
import { ORDER_COMPONENTS } from './order';
import { SignUpComponent } from './sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-pagination-bootstrap';




@NgModule({
  imports: [
    BrowserAnimationsModule, 
    BsDatepickerModule.forRoot(), 
    TooltipModule.forRoot(), 
    FileUploadModule, 
    RecaptchaModule.forRoot(),
    PopoverModule.forRoot(), 
    RecaptchaFormsModule, 
    SignUpRoutingModule, 
    NgxPaginationModule,
    PaginationModule,
    CoreModule, 
    SharedModule,
    Angular2CsvModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    PdfViewerModule,  

  ],
  declarations: [
    SignUpComponent, 
    ORDER_COMPONENTS,
    PAYMENT_COMPONENTS,
    LOADER_COMPONENTS,
   
   ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.reCaptchaSiteKey, size: 'invisible' } as RecaptchaSettings,
    },
  ],
  bootstrap: [ SignUpComponent ]
})
export class SignUpModule {
  constructor() {
  }
}
