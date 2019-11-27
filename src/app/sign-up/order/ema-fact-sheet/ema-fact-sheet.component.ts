import { CustomerDto } from './../../../core/customer-dto';
import { Component, OnInit, Host } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorage } from '@ngx-pwa/local-storage';

import { GoogleTagManagerService, PricingPlan } from '@app/core';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES, STORAGE_KEYS } from '../order.constant';
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
  customerObj:CustomerDto;

  acknowledge=false;
  acknowledge1=false;

  constructor(
    @Host() public parent: OrderComponent,
    private localStorage: LocalStorage,
    private gtagService: GoogleTagManagerService,
    private router: Router,
    private toster: ToastrService,
    private service:ApiServiceServiceService,
  ) { }

  ngOnInit() {

    // this.localStorage.getItem<PricingPlan>(STORAGE_KEYS.PRICING_PLAN)
    //   .subscribe(selectedPricingPlan => {
    //     if (selectedPricingPlan) {
    //       this.emaFactSheetPdfFileName = 'https://' + selectedPricingPlan.factSheetPDF;
    //       this.emaFactSheetImageFileName = 'https://' + selectedPricingPlan.factSheetPNG;
    //     } else {
    //       this.parent.clearLocalStorage();
    //       const modalConfig: { [ key: string ]: any } = {
    //         events: {
    //           onHidden: (reason: string) => {
    //             this.parent.modal.hide();
    //             this.router.navigate(['']);
    //           }
    //         }
    //       };
    //       this.parent.openErrorModal('Errors', 'You need to select your pricing plan first!', modalConfig);
    //     }
    //   });

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
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.REVIEW_ORDER_1);
      this.parent.saveAndNext();
    }
    else {
      this.toster.error('', 'Please select the mandatory checkboxes.',{
        timeOut : 3000
      });
    }
  }


  getPlanFactSheet(planName){  
      this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet+"?planName="+planName).subscribe(response=>{
        var data = "data:application/pdf;base64," +response['data']
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
