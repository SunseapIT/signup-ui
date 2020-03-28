import { AddPromocodeComponent } from './promo-code/add-promocode/add-promocode.component';
import { AbandonedSignupComponent } from './audit/abandoned-signup/abandoned-signup.component';
import { SuccessfullSignupComponent } from './audit/successfull-signup/successfull-signup.component';
import { ViewPromocodeComponent } from './promo-code/view-promocode/view-promocode.component';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { ApproveComponent } from './approve/approve.component';
import { AuthguardGuard } from './../../authguard.guard';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { AuditComponent } from './audit/audit.component';
import { TestCaptchComponent } from './test-captch/test-captch.component';



const routes: Routes = [
   
     {path: 'login', component: AdminLoginComponent  },
     { path: 'admin-dash',  component: AdminDashboardComponent,canActivate : [AuthguardGuard],
      children:[
      {path: '' , component: AddPlanComponent},
      {path : 'view-plan', component : ViewPlanComponent},
      {path: 'successful' , component: SuccessfullSignupComponent},
      {path: 'abandoned', component:AbandonedSignupComponent},
      {path: 'approve' , component: ApproveComponent},
      {path: 'promo', component:AddPromocodeComponent},
      {path: 'edit/:id', component : AddPromocodeComponent},
      {path: 'view-promo', component:ViewPromocodeComponent},
     
    
    ]  },
    {path: 'captcha', component: TestCaptchComponent}
     

  
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class AdminLoginRoutingModule { }