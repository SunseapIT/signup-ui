import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerDto } from '@app/core/customer-dto';

@Component({
  selector: 'app-consumer-login',
  templateUrl: './consumer-login.component.html',
  styleUrls: ['./consumer-login.component.scss']
})
export class ConsumerLoginComponent implements OnInit {
  model = {userId : "", password : "", mobileNumber : "",  otp : ""};
  verifiedMobileNo = '';
  userId = '';

  customerDto = new CustomerDto;
  constructor(private _service : ApiServiceServiceService,
    private toster: ToastrService,
    private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form:NgForm){
    if(form.value){
   var data:any[] = form.value;
   this.customerDto.eamilAddress = this.model.userId;
    this._service.post_service(ApiServiceServiceService.apiList.userLogin,data).subscribe
      (response =>{ 
        var responseBody = response['body'];
        var responseMessage = responseBody['message'];
      var responseData = responseBody['data'];
      
      if(responseBody['statusCode']==200){
        var resultObject = responseData
        var token = resultObject['token'];
        localStorage.setItem("Authorization",token);
        this.router.navigateByUrl('/consumer/profile')
        this.toster.success('', responseMessage, {
          timeOut: 2000
        });
        localStorage.setItem("Customer_Details", JSON.stringify(this.customerDto))
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
      this.verifiedMobileNo = this.model.mobileNumber;
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
