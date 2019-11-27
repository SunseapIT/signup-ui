import { LoginBean } from './../../../core/login-bean';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ORDER_ROUTES } from '@app/sign-up/order';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
 
  model: any = {};
  // username : any;
  // password: any;
  constructor(private router:Router,
    private apiService :ApiServiceServiceService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }


  onSubmit(form: NgForm) {        

    var loginBean = new LoginBean();
    loginBean.userId = form.value.username;
    loginBean.password = form.value.password;
    this.apiService.post_service(ApiServiceServiceService.apiList.adminLogin,loginBean).subscribe((response)=>{
      
      var responseData = response;
      //checking status code
      if(responseData['statusCode']==200){
        var resultObject = responseData['data']
        var token = resultObject['token'];
        localStorage.setItem("Authorization",token);
        this.router.navigateByUrl('/admin-login/admin-dash')
      }
      else{
        this.toastr.error('', 'Incorrect username or password', {
          timeOut: 3000
        });
      
      }     
      
    })
   }

   home(){
     this.router.navigateByUrl(ORDER_ROUTES.PLAN_DETAIL);
   }
}
