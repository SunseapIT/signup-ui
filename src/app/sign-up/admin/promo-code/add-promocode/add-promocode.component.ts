import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Promocode } from './../../dto/promo-dto';
import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import * as moment from 'moment'
@Component({
  selector: 'app-add-promocode',
  templateUrl: './add-promocode.component.html',
  styleUrls: ['./add-promocode.component.scss']
})
export class AddPromocodeComponent implements OnInit {
  model:any ={ promoCode : '', dateFrom : '', dateTo : '', isInfinity : "true", noOfLimitedUsers : ''  };
  public dateTimeRange:any;
  btnvisibility: boolean = true;  
  isLoader:boolean;

  constructor(private service : ApiServiceServiceService,
    private dateFormat:DatePipe,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private toastr:ToastrService) { }

    responseData:any={}

  ngOnInit() {
    this.getPromoCodeById();
    
  }


  getPromoCodeById(){
    let id = this.activatedRoute.snapshot.params['id'];
    console.log(id);
    let datefrom = new Date()
    
  if(id){
   this.service.get_service(ApiServiceServiceService.apiList.getPromoCodeById+"?promoId="+id).subscribe((response:any)=>{
   
     let datefrom:any[]=[]
     datefrom.push(moment(response.data.dateFrom,"DD-MM-YYYY,h:mm:ss").format())
     datefrom.push(moment(response.data.dateTo,"DD-MM-YYYY,h:mm:ss").format())
     this.responseData = response.data
     this.dateTimeRange = datefrom;    
   //  this.dateTimeRange=momemt(response.data.dateFrom).format()
     // this.model.promoCode = response.data.promoCode;

     // this.model.dateFrom = response.data.dateFrom;
     // this.model.noOfLimitedUsers = response.data.noOfLimitedUsers;    
   })
    
  }


  }


getTimeStamp(time){
  return this.dateFormat.transform(time,"dd-MM-yyyy hh:mm:ss");
}

  onSubmit(form: NgForm){
    this.responseData.dateFrom=this.getTimeStamp(this.dateTimeRange[0])
    this.responseData.dateTo=this.getTimeStamp(this.dateTimeRange[1])
    this.responseData.noOfLimitedUsers=this.responseData.infinity?null:this.responseData.noOfLimitedUsers
    console.log(this.responseData);
    if(form.valid){
      this.isLoader=true;
      // var promocode = new Promocode()
      // promocode.promoCode = this.model.promoCode;
      // promocode.dateFrom = this.getTimeStamp(this.dateTimeRange[0]);
      // promocode.dateTo = this.getTimeStamp(this.dateTimeRange[1])
      // promocode.infinity = this.model.isInfinity;
      // promocode.noOfLimitedUsers = this.model.noOfLimitedUsers;
      // console.log('promocode added', promocode);
      this.service.post_service(ApiServiceServiceService.apiList.addPromoCodeUrl,this.responseData).subscribe((response)=>{
       let responseData = response;
        let statusCode = responseData['statusCode']
        if(statusCode == 200){
        this.isLoader=false;

        this.router.navigateByUrl('/admin-login/admin-dash/view-promo')
        this.toastr.success('', 'Promo Code added successfully', {
         timeOut: 2000
         });
       }         
      })
      form.resetForm();      
  }
 }

}
