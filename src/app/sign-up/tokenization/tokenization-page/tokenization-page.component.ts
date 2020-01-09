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
  modal:any={}
  customerDetail=[];
  currentMonth:any;
  customerObj:CustomerDto;
  isCardAdded:boolean=false;
  userName:any;
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
      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no="+spAccountNumber, paymentDto).
      subscribe((response)=>{
      
        var responseData  = response;   
        if(responseData['statusCode']==201){
          this.isCardAdded=true;
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
    this.modal.expYear = "";
  }
 
  onSelectYear(event){
    this.monthIndex = this.months.findIndex(item => item.monthId == this.modal.expMonth);
    if(this.expYear == Number(this.modal.expYear)){
      if(this.monthIndex > -1 && this.monthIndex < this.expMonth){
        console.log('First If Block');
        
        this.modal.expMonth = "";
        this.toster.error('','This card has been expired 1.', {
          timeOut : 3000
        })

        
      }
      if((Number(this.modal.expMonth) > this.expMonth+1) && (this.months.length <= (this.expMonth +3))){
        console.log('Second If Block');
        this.modal.expMonth = "";
        this.toster.error('','This card has been expired 2.', {
          timeOut : 3000
        })
       }
     // else{
      //   this.modal.expMonth = "";
      //   this.toster.error('','This card has been expired 3.', {
      //     timeOut : 3000
      //   })
      // }
    }
    else{
      if(this.expYear == this.modal.expYear){
        console.log('Third If Block');
        if(this.monthIndex +3 ){
          this.modal.expMonth = "";
          this.toster.error('','This card is invalid.', {
            timeOut : 3000
          })
        }
      }
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
