import { Component, OnInit } from '@angular/core';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { PaymentDto } from '@app/core/services/token-dto';
import { CustomerDto } from '@app/core/customer-dto';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare const $:any;

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  constructor(private service: ApiServiceServiceService,
    private router : Router,
    private toster : ToastrService,
    private activatedRoute: ActivatedRoute) { }
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

  spAccountNumber:any;
  sp;
  ngOnInit() {

  
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.spAccountNumber = JSON.parse(atob(params.spActNo))
      console.log("params : ",this.spAccountNumber);
      
    })

    this.getUserDetail();
    this.expYear = new Date().getFullYear();
    this.expMonth = new Date().getMonth();
    for(let i=0; i<10; i++){
      this.years.push(this.expYear +i);
    }
  //   this.spAccountNumber = this.activatedRoute.params.subscribe(params => {
  //     this.sp = +params['sp']; 
  //  });
  
   console.log('this.spAccountNumber=',this.spAccountNumber);
   console.log(this.sp);

  }



  getUserDetail(){
     var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr);
  
    }

  onSubmit(form:NgForm){
    // console.log("---- form is : ",form.value);
    
    if(form.valid && this.isCardValid){
    var customerDto = new CustomerDto();
     var objStr = localStorage.getItem("customerObj");
     customerDto = JSON.parse(objStr);
    //  var spAccountNumber = customerDto.spAccountNumber;
     var paymentDto = new PaymentDto()
      paymentDto.cardNumber = form.value.cardNumber;
      paymentDto.expiryMonth = form.value.expMonth;
      paymentDto.expiryYear = form.value.expYear;
      paymentDto.sourceType = "CARD";
      // console.log("before is : ",this.spAccountNumber);
      
      this.service.post_service(ApiServiceServiceService.apiList.addCardDetailUrl+"?sp_account_no="+this.spAccountNumber, paymentDto).
      subscribe((response)=>{
        var responseBody = response['body'];
      var responseMessage = responseBody['message'];
      let statusCode = responseBody['statusCode']
        if( statusCode==201){
          this.isCardAdded=true;
          localStorage.removeItem("customerObj")
          localStorage.removeItem("Token")
          this.router.navigateByUrl('/consumer/profile');
          form.resetForm()

        }
        else if(statusCode == 500 || statusCode == 400){
          this.toster.error('',"Invalid card number.", {
            timeOut : 3000
          })
        }
        else{
          this.toster.error('',responseMessage, {
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
    this.router.navigateByUrl('/consumer/profile');
  }
}
