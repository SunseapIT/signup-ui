import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
@Component({
  selector: 'app-add-promocode',
  templateUrl: './add-promocode.component.html',
  styleUrls: ['./add-promocode.component.scss']
})
export class AddPromocodeComponent implements OnInit {
  model:any ={ promoCode : '', dateFrom : '', dateTo : '', infinity : "true", noOfLimitedUsers : ''  };
  public dateTimeRange:any; 
  isLoader:boolean;
  responseData:any={}
  min = new Date();
  hour12Timer:boolean= false

  constructor(private service : ApiServiceServiceService,
    private dateFormat:DatePipe,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private toastr:ToastrService) { }

   

  ngOnInit() {
    this.getPromoCodeById();    
  }


  getPromoCodeById(){
    let id = this.activatedRoute.snapshot.params['id'];  
   if(id!=null){
   this.service.get_service(ApiServiceServiceService.apiList.getPromoCodeById+"?promoId="+id).subscribe((response:any)=>{   
     let datefrom:any[]=[]
     datefrom.push(moment(response.data.dateFrom,"DD-MM-YYYY,H:mm:ss").format())
     datefrom.push(moment(response.data.dateTo,"DD-MM-YYYY,H:mm:ss").format())
     this.responseData = response.data
     this.dateTimeRange = datefrom;
   })    
  }
  }


getTimeStamp(time){
  return this.dateFormat.transform(time,"dd-MM-yyyy H:mm:ss");
}

  onSubmit(form: NgForm){   
    if(form.valid){
      this.isLoader=true;
    this.responseData.dateFrom=this.getTimeStamp(this.dateTimeRange[0])
    this.responseData.dateTo=this.getTimeStamp(this.dateTimeRange[1])
    this.responseData.noOfLimitedUsers=this.responseData.infinity?null:this.responseData.noOfLimitedUsers;
    if(form.valid){
      this.isLoader=true;
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
 else{
  this.toastr.error('', 'Please fill the form.', {
    timeOut: 2000
    });
 }
}

}

// ^((?!(0))[0-9]{9})$
