import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerLoginComponent } from './consumer-login/consumer-login.component';
import { ConsumerDashboardComponent } from './consumer-dashboard/consumer-dashboard.component';
import { AuthguardGuard } from '@app/authguard.guard';
import { ProfileComponent } from './profile/profile.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
   
     {path : 'login', component: ConsumerLoginComponent },
     {path : 'profile', component : ConsumerDashboardComponent,
    children : [
      {path: '' , component: ProfileComponent },
     
    ]},
    {path : 'verify_email', component : VerifyemailComponent},
    {path : 'change_password', component : ChangePasswordComponent}
    
    ] ;


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class ConsumerRoutingModule { }