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



const routes: Routes = [
   
     {path: 'login', component: AdminLoginComponent  },
     { path: 'admin-dash',  component: AdminDashboardComponent,canActivate : [AuthguardGuard],
      children:[
      {path: '' , component: AddPlanComponent},
      {path : 'view-plan', component : ViewPlanComponent},
      {path: 'audit' , component: AuditComponent},
      {path: 'approve' , component: ApproveComponent},
    ]  },
     

  
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