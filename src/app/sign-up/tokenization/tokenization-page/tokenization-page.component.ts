import { ToastrService } from 'ngx-toastr';
import { PaymentDto } from './../../../core/services/token-dto';
import { CustomerDto } from '@app/core/customer-dto';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ORDER_ROUTES } from '@app/sign-up/order';
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
  modal:any={};
  customerDetail=[];
  currentMonth:any;
  customerObj:CustomerDto;
  isCardAdded:boolean=false;
  userName:any;
  isCardValid:boolean=false;
  years = [];
  expYear:any;
  expMonth:any;
  monthIndex:number;
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

  ngOnInit() {
    this.getUserDetail();
    this.expYear = new Date().getFullYear();
    this.expMonth = new Date().getMonth();
    for(let i=0; i<10; i++){
      this.years.push(this.expYear +i);
    }
  }


  
  getUserDetail(){
     var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr); 
     this.userName = customerDto.fullName.concat(" ").concat(customerDto.lastName);
    }

  onSubmit(form:NgForm){       
    if(form.valid && this.isCardValid){    
    var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr); 
     var spAccountNumber = customerDto.spAccountNumber;
     var paymentDto = new PaymentDto()
      paymentDto.cardNumber = form.value.cardNumber;
      paymentDto.expiryMonth = form.value.expMonth;
      paymentDto.expiryYear = form.value.expYear;
      paymentDto.sourceType = "CARD"       
      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no="+spAccountNumber, paymentDto).
      subscribe((response)=>{  
        var responseData  = response;  
        
        let statusCode = responseData['statusCode'];       
        if( statusCode==201){
          this.isCardAdded=true;
          localStorage.removeItem("customerObj")
          localStorage.removeItem("Token")
          this.router.navigateByUrl(ORDER_ROUTES.ORDER_CONFIRMATION);
          form.resetForm()
    
        }
        else if(statusCode == 500 || statusCode == 400){         
          this.toster.error('',"Invalid card number.", {
            timeOut : 3000
          }) 
        }
        else{
          this.toster.error('',responseData['message'], {
            timeOut : 3000
          })
        }
              
      })   
    }
  }

 
  cardValidation(event){
    this.isCardValid = true;   
    this.monthIndex = this.months.findIndex(item => item.monthId == this.modal.expMonth);
    let beforeDate = new Date(this.expYear, this.expMonth+3, 1).getTime();
    let currentDate = new Date().getTime();
    let selectedDate = new Date(Number(this.modal.expYear), this.monthIndex, 1).getTime();
    if(selectedDate < beforeDate){
      this.isCardValid = false;
      this.toster.error('','This card has been expired.', {
               timeOut : 3000
            })      
    }
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
