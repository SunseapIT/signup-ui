import { TimeStampDto } from './../../admin/dto/time-stamp-dto';

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

  onSubmit() {
    if (this.confirmationChecked && this.policyChecked) {
      var customerDto = new CustomerDto();
      var objStr = localStorage.getItem("customerObj");
      customerDto = JSON.parse(objStr);
      customerDto.files.factSheet_data = this.pdf;
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
      var responseData = responseBody['data'];   
      this.pdf = responseData;
      var data = "data:application/pdf;base64," +responseData
      this.pdfSrc = data;   
      })    
  }

  downloadFactSheet(){
    const linkSource = this.pdfSrc;
    const downloadLink = document.createElement("a");
    const fileName = "factSheet.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
