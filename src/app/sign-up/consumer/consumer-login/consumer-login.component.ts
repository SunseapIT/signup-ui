import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consumer-login',
  templateUrl: './consumer-login.component.html',
  styleUrls: ['./consumer-login.component.scss']
})
export class ConsumerLoginComponent implements OnInit {
  model = {userId : "", password : "", mobile : "",  otpMobile : ""};
  verifiedMobileNo = '';
  userId = '';
  constructor(private _service : ApiServiceServiceService,
    private toster: ToastrService,
    private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form:NgForm){
    if(form.value){
   var data:any[] = form.value;
    this._service.post_service(ApiServiceServiceService.apiList.userLogin,data).subscribe
      (response =>{ 
      var responseBody = response['body'];
      var responseMessage = responseBody['message'];
      let statusCode = responseBody['statusCode']
      if (statusCode == 200) {
        this.router.navigateByUrl('/consumer/login/')
        this.toster.success('', responseMessage, {
          timeOut: 2000
        });
        form.resetForm();
      }
      else{
        this.toster.error('', responseMessage, {
          timeOut: 3000
        })
      }
    }) 
}
else {
  this.toster.error('', 'Enter User Id.', {
    timeOut: 3000
  });
}
    }
   
    generateMobileOtp(){
      this.userId = this.model.userId;
      this.verifiedMobileNo = this.model.mobile;
      this._service.post_service(ApiServiceServiceService.apiList.generateMobileOtp + "?userId=" + this.userId +
        "&mobileNumber=" + this.verifiedMobileNo, null)
        .subscribe((response) => {
          
      var responseBody = response['body'];
      var responseMessage = responseBody['message'];
      let statusCode = responseBody['statusCode']
      if (statusCode == 200) {
        this.toster.success('', 'OTP has been sent to registered mobile number.', {
          timeOut: 2000
        });
      }
      else{

        this.toster.error('', responseMessage, {
          timeOut: 3000
        })
      }
    }) 
}

  
}
