import { Component, OnInit } from '@angular/core';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerDto } from '@app/core/customer-dto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  customerPlanDetail:any =[];

  constructor(private _service  : ApiServiceServiceService,
    private toastre : ToastrModule,
    private route : Router) { }

  ngOnInit() {
    this.getCustomerDetailByEmail();
  }

  userId:any;
  getCustomerDetailByEmail(){
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("Customer_Details");
    customerDto = JSON.parse(objStr);
    this.userId = customerDto.eamilAddress;
    
    this._service.get_service(ApiServiceServiceService.apiList.getCustomerDetailsByEmail+"?email="+this.userId).subscribe(
      (response =>{
        console.log('customer details',response);
        
      })
    )
  }

}
