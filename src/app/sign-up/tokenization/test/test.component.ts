
import { ToastrService } from 'ngx-toastr';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { NgForm } from '@angular/forms';
import { PaymentDto } from './../../../core/services/token-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerDto } from './../../../core/customer-dto';
import { Component, OnInit } from '@angular/core';
import { ORDER_ROUTES } from '@app/sign-up/order';
declare const $:any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private service: ApiServiceServiceService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private toster : ToastrService) { }
    
  modal:any={}
  customerDto:CustomerDto;
  isCardAdded:boolean=false;
  userName:any;
  isCardValid:boolean=false;
  years = [];
  expYear:any;
  expMonth:any;
  monthIndex:number;
  spAccountNumber:any;
  routeData={};
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
    let id = this.activatedRoute.snapshot.params['spAccount']; 
   this.activatedRoute.queryParamMap.subscribe(params => {
    this.routeData =params['params'].id;
  });   
    this.service.get_service(ApiServiceServiceService.apiList.getCustomerSpAccountUrl+"?spAccount="+this.routeData).subscribe((response:any)=>{
      let customerData = response.data;
      this.spAccountNumber = customerData.spAccountNumber   
      this.userName = customerData.fullName.concat(" ").concat(customerData.lastName);

    })
    }

  onSubmit(form:NgForm){       
    if(form.valid && this.isCardValid){          
     var paymentDto = new PaymentDto()
      paymentDto.cardNumber = form.value.cardNumber;
      paymentDto.expiryMonth = form.value.expMonth;
      paymentDto.expiryYear = form.value.expYear;
      paymentDto.sourceType = "CARD"      
      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no="+this.spAccountNumber, paymentDto).
      subscribe((response)=>{
        var responseData  = response;  
        let statusCode = responseData['statusCode'];       
        if( statusCode==201){
          this.isCardAdded=true;
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
