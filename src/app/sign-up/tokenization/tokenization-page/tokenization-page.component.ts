import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { PaymentDto } from './../../../core/services/token-dto';
import { CustomerDto } from '@app/core/customer-dto';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ORDER_ROUTES } from '@app/sign-up/order';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
declare const $:any;


@Component({
  selector: 'app-tokenization-page',
  templateUrl: './tokenization-page.component.html',
  styleUrls: ['./tokenization-page.component.scss']
})
export class TokenizationPageComponent implements OnInit {

  constructor(private service: ApiServiceServiceService,
    private router : Router,
    private toster : ToastrService) { }
  modal:any={}
  customerDetail=[];
  customerObj:CustomerDto;
  isCardAdded:boolean=false;
  userName:any;
  months = [ 
  {monthId : "01", name :"Jan"},
  {monthId : "02", name :"Feb"},
  {monthId : "03", name :"March"},
  {monthId : "04", name :"April"},
  {monthId : "05", name :"May"},
  {monthId : "06", name :"June"},
  {monthId : "07", name :"July"},
  {monthId : "08", name :"Aug"},
  {monthId : "09", name :"Sep"},
  {monthId : "10", name :"Oct"},
  {monthId : "11", name :"Nov"},
  {monthId : "12", name :"Dec"},
  ]
  years = [ 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  ngOnInit() {
    this.getUserDetail();
  }
 

  getUserDetail(){
     var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr); 
     this.userName = customerDto.fullName.concat(" ").concat(customerDto.lastName);

 

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
      this.isCardAdded=true;
      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no="+spAccountNumber, paymentDto).
      subscribe((response)=>{
        this.isCardAdded=false;
        var responseData  = response;   
        if(responseData['statusCode']==201){
          localStorage.removeItem("customerObj")
          localStorage.removeItem("Token")
          this.router.navigateByUrl(ORDER_ROUTES.ORDER_CONFIRMATION);

          form.resetForm()
    
        }
        else{
          this.toster.error('',responseData['message'], {
            timeOut : 3000
          })
        }        
      })   
    }
  }

  onSelectMonth(event){
    let selectedMonth = event.target.value;
  }



  onSelectYear(event){
    let selectedYear = event.target.value;
  }


  cancel(){
    $('#cancel').modal('show');    
  }

  no(){
    $('#cancel').modal('hide')
  }

  yes(){
    this.router.navigateByUrl(ORDER_ROUTES.ORDER_CONFIRMATION);



    
  }
}
