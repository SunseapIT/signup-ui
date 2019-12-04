import { HttpParams } from '@angular/common/http';
import { PaymentDto } from './../../../core/services/token-dto';
import { CustomerDto } from '@app/core/customer-dto';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';


@Component({
  selector: 'app-tokenization-page',
  templateUrl: './tokenization-page.component.html',
  styleUrls: ['./tokenization-page.component.scss']
})
export class TokenizationPageComponent implements OnInit {

  constructor(private service: ApiServiceServiceService) { }
  modal:any={}
  customerDetail=[];
  customerObj:CustomerDto;

  months = ['jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
  years = [ 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  ngOnInit() {
    this.getUserDetail();
  }

  userName:any;

  getUserDetail(){
     var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr); 
     this.userName = customerDto.fullName;

     console.log("Token customer name", this.userName);
     

  }

  onSubmit(form:NgForm){
    if(form.valid){
    var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr); 
     var spAccountNumber = customerDto.spAccountNumber;

      var paymentDto = new PaymentDto()
      paymentDto.cardNumber = form.value.cardNumber;
      paymentDto.expiryMonth = form.value.expMonth;
      paymentDto.expiryYear = form.value.expYear;
      paymentDto.sourceType = "CARD"

      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no"+spAccountNumber, paymentDto).
      subscribe((response)=>{
        console.log("token response",response);
        
      })



       
    }
  }

  onSelectMonth(event){
    let selectedMonth = event.target.value;
  }



  onSelectYear(event){
    let selectedYear = event.target.value;
  }
}
