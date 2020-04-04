import { Component, OnInit } from '@angular/core';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  model = {userId : "", password : "", confirmPassword : ""};
  userId = '';

  constructor(private _service : ApiServiceServiceService,
    private toster: ToastrService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form:NgForm){
     let data:any[] = form.value; 
     console.log('data',data);
     this._service.post_service(ApiServiceServiceService.apiList.changePassword,data).subscribe(response=>{
       console.log('change',response);
    var responseBody = response['body'];
          var responseMessage = responseBody['message'];
          let statusCode = responseBody['statusCode']
          if (statusCode == 200) {
            this.router.navigateByUrl('/consumer/login')
            this.toster.success('', responseMessage, {
              timeOut: 2000
            });
            form.resetForm();
          }
          else if (statusCode == 500 || statusCode == 400) {
            this.toster.error('', responseMessage, {
              timeOut: 3000
            })
          }
         
        })
      

  }

  
  isPasswordConfirmed() {
    return (this.model.password === this.model.confirmPassword);
  }
}