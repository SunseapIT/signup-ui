import { Component, OnInit } from '@angular/core';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerDto } from '@app/core/customer-dto';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {

  model = {userId : "",  otp : ""};
  userId = '';
  confirmPassword='';
  customerDto = new CustomerDto;
  constructor(private _service : ApiServiceServiceService,
    private toster: ToastrService,
    private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form:NgForm){
    if(form.value){
     let data:any[] = form.value;
     this.customerDto.eamilAddress = this.model.userId;

     this._service.post_service(ApiServiceServiceService.apiList.verifyEmailOtp,data).subscribe(response=>{
      console.log('submit', response);
      
      var responseBody = response['body'];
       var responseMessage = responseBody['message'];
       let statusCode = responseBody['statusCode']
       if (statusCode == 200) {
        localStorage.setItem("Customer_Details", JSON.stringify(this.customerDto))
         this.router.navigateByUrl('/consumer/change_password')
         this.toster.success('', 'Email verified successfully', {
           timeOut: 2000
         });
       }
       else if (statusCode == 500 || statusCode == 400) {

         this.toster.error('', responseMessage, {
           timeOut: 3000
         })
       }
     })
   form.resetForm();
 }
 else {
   this.toster.error('', 'Enter User Id.', {
     timeOut: 3000
   });
 }
  }

  requestEmailOtp(){
   this.userId= this.model.userId;
   this._service.post_service(ApiServiceServiceService.apiList.requestEmailOtp +"?userId=" + this.userId,null ).subscribe
   (response => {   
    console.log(response);
      var responseBody = response['body']
       var responseMessage = responseBody['message'];
       let statusCode = responseBody['statusCode']
       if (statusCode == 200) {
        //  this.router.navigateByUrl('/admin-login/admin-dash/view-plan')
         this.toster.success('', 'OTP has been sent on registered email address.', {
           timeOut: 2000
         });
       }
       else if (statusCode == 500 || statusCode == 400) {

         this.toster.error('', responseMessage, {
           timeOut: 3000
         })
       }
      })
    }

}
