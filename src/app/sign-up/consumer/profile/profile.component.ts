import { Component, OnInit } from "@angular/core";
import { ApiServiceServiceService } from "@app/api-service-service.service";
import { ToastrModule } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomerDto } from "@app/core/customer-dto";
import { serviceAddressDto } from "@app/core/service-address-dto";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {

  
  customerPlanDetail: CustomerDto[] = [];
  serviceAddresses : serviceAddressDto[] = [];
  customerDto: CustomerDto = null;
  sp:any;

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
          this.customerPlanDetail = response.body.data; 
          this.createServiceAddresses();    
          this.assignDefaultServiceAddress();
        }
      });
  }
  createServiceAddresses() {
    this.serviceAddresses =this.customerPlanDetail.map(item=> {return {...item, serviceAddress: item.houseNo + ' ' + item.buildingName + ' ' + item.streetName + '-' + item.postelCode,spAccountNo:item.spAccountNumber}});     
  }

  assignDefaultServiceAddress() {
    if (this.customerPlanDetail != null && this.customerPlanDetail.length > 0) {
      this.customerDto = this.customerPlanDetail[0];
    }
  }

  onSelectServiceAddress(event){
    this.customerDto = this.customerPlanDetail.find(item=> item.spAccountNumber == event);
    console.log('this.customerDto event',this.customerDto );
    console.log('this.customerDto event sp',this.customerDto.spAccountNumber );
    this.sp =this.customerDto.spAccountNumber;
    console.log('this.sp',this.sp);
    
    
  }

  goToCard(){
  
    this.route.navigate(['consumer/profile/add-card']);
  }

 
}
