// import { TimeStampDto } from './../../admin/dto/time-stamp-dto';
import { TimeStampDto } from "../../../core/time-stamp-dto";


import { CustomerDto } from './../../../core/customer-dto';
import { Component, OnInit, Host, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorage } from '@ngx-pwa/local-storage';

import { GoogleTagManagerService, PricingPlan } from '@app/core';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES } from '../order.constant';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceServiceService } from '@app/api-service-service.service';

@Component({
  selector: 'app-ema-fact-sheet',
  templateUrl: './ema-fact-sheet.component.html',
})
export class EmaFactSheetComponent implements OnInit {

  confirmationChecked = false;
  policyChecked = false;
  emaFactSheetImageFileName: string;
  emaFactSheetPdfFileName: string;
  pdfSrc;
  pdf;
  customerObj:CustomerDto;

  acknowledge=false;
  acknowledge1=false;
  isLoader:boolean=false;
  fileName: string;

  constructor(
    @Host() public parent: OrderComponent,
    private localStorage: LocalStorage,
    private gtagService: GoogleTagManagerService,
    private router: Router,
    private toster: ToastrService,
    private service:ApiServiceServiceService,
  ) {}

  ngOnInit() {
    this.customerObj =  JSON.parse(localStorage.getItem("customerObj"));
    this.getPlanFactSheet(this.customerObj.plan);
  }

  onAckFactsheetClick() {
    if (!this.confirmationChecked) {
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ACK_FACTSHEET);
    }
  }

  onAckTermAndConditionClick() {
    if (!this.policyChecked) {
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ACK_TERM_AND_CONDITION);
    }
  }

  // factSheetS3RefId:any
  onSubmit() {
    if (this.confirmationChecked && this.policyChecked) {
      var customerDto = new CustomerDto();
      var objStr = localStorage.getItem("customerObj");
      customerDto = JSON.parse(objStr);
      customerDto.files.factSheet_data = this.pdf;
      // let uploadFileUrl = "https://31w0n4cnk1.execute-api.ap-south-1.amazonaws.com/thrymr/s3";
      // this.service.post_service(uploadFileUrl,this.pdf).subscribe((response) => {
      //   console.log("Upload file ======", response);
      //   if(response.body.statusCode == 200){
      //     this.factSheetS3RefId=response.body.data
      //     this.toster.success(response.body.message)
      //   }
      //   else if(response.body.statusCode == 500){
      //     this.toster.error(response.body.message)
      //   }
      // })
      // customerDto.files.factSheetS3RefId=this.factSheetS3RefId
      localStorage.setItem("customerObj",JSON.stringify(customerDto))
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "REVIEW_ORDER",
      timeStampDto.token = localStorage.getItem("Token")     
      this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{        
      })      
      this.parent.saveAndNext();
    }
    else {
      this.toster.error('', 'Please select the mandatory checkboxes.',{
        timeOut : 3000
      });
    }
  }

  getPlanFactSheet(planName){  
    this.isLoader=true;
    this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet+"?planName="+(btoa(planName))).subscribe(response=>{
      this.isLoader = false;
      var responseBody = response['body'];
      var responseData = responseBody['data'].FILE_CONTENT;  
       this.fileName = responseBody['data'].FILE_NAME;   
      this.pdf = responseData;
      var data = "data:application/pdf;base64," +responseData
      this.pdfSrc = data;   
      })    
  }

  downloadFactSheet(){
    const linkSource = this.pdfSrc;
    const downloadLink = document.createElement("a");
    const fileName = this.fileName;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
