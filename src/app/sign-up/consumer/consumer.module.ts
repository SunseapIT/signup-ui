import { ORDER_COMPONENTS } from "../order";
import { SharedModule } from "@app/shared";
import { ToastrModule } from "ngx-toastr";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ConsumerRoutingModule } from "./consumer-routing.module";
import { ConsumerLoginComponent } from './consumer-login/consumer-login.component';
import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
    imports: [
      CommonModule,
      ConsumerRoutingModule,
      FormsModule,
      ToastrModule.forRoot(),
      SharedModule,
    ],
    declarations: [
        
    ConsumerLoginComponent,
        
    ConsumerDashboardComponent,
        
    ProfileComponent,
        
    SideBarComponent,
        
    VerifyemailComponent,
        
    ChangePasswordComponent],
    providers: [
      ORDER_COMPONENTS
    ]
  })
  
  export class ConsumerModule { }