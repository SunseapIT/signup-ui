import { Component, OnInit } from "@angular/core";
import { ApiServiceServiceService } from "@app/api-service-service.service";
import { ToastrModule } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomerDto } from "@app/core/customer-dto";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  customerPlanDetail: CustomerDto[] = [];
  customerDto: CustomerDto = null;

  constructor(
    private _service: ApiServiceServiceService,
    private toastre: ToastrModule,
    private route: Router,
  ) {}

  userId: any;

  ngOnInit() {
    
    this.getCustomerDetailByEmail();
  }

  getCustomerDetailByEmail() {
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("Customer_Details");
    customerDto = JSON.parse(objStr);
    this.userId = customerDto.eamilAddress;
    this._service.get_service(ApiServiceServiceService.apiList.getCustomerDetailsByEmail +"?email=" + this.userId)
      .subscribe(response => {
        if (response.body.statusCode == 200 ) {
          this.customerPlanDetail = response.body.data.map(item=> {return {...item, address: item.houseNo + ' ' + item.buildingName + ' ' + item.streetName + '-' + item.postelCode}});     
          this.assignDefaultServiceAddress();
        }
      });
  }

  assignDefaultServiceAddress() {
    if (this.customerPlanDetail != null && this.customerPlanDetail.length > 0) {
      this.customerDto = this.customerPlanDetail[0];
      this.onSelectServiceAddress(this.customerPlanDetail);     
    }
  }

  onSelectServiceAddress(event){
    console.log(event);
   
  }

}
