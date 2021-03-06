import { ToastrService } from 'ngx-toastr';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, OnInit, Host, ViewChild, HostListener, ViewChildren, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { OrderComponent } from '../order.component';
import { STORAGE_KEYS, ORDER_GA_EVENT_NAMES } from '../order.constant';

import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { PDFDocumentProxy } from 'pdfjs-dist';
import {
  PricingPlan,
  PricingPlanService,
  ConfigService,
  ModalService,
  UtilService,
  SuccessResponse,
  PotentialCustomer,
  GoogleTagManagerService
} from '@app/core';
import { NgForm } from '@angular/forms';
import { PlanBean } from '@app/core/plan-bean';
import { CustomerDto } from '@app/core/customer-dto';
import { TimeStampDto } from '@app/core/time-stamp-dto';

declare var $: any;
const LIST_PRICE_PLAN_BY_REF_OR_PRO_CODE = {
  '50XMAS18': ['SUNSEAP-ONE_DOT_12MTHS', 'SUNSEAP-ONE_DOT_24MTHS', 'SUNSEAP-50_DOT', 'SUNSEAP-100_DOT', 'SUNSEAP-ONE_FIX_12MTHS',
    'SUNSEAP-ONE_FIX_24MTHS', 'SUNSEAP-50_FIX', 'SUNSEAP-100_FIX']
};

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
})
export class PlanDetailComponent implements OnInit {
  planName: string = "";
  @ViewChild('advisory') advisory: any;
  @ViewChild('postalCodeOverlay') postalCodeOverlay: any;
  @ViewChildren('popover') popover: any;

  @ViewChild("pdfViewFactSheetModal") pdfViewFactSheetModal: ModalDirective;
  _pdf: PDFDocumentProxy;
  serviceNos:any
  config = { bootstrap: null, dateTimeFormat: null, validationRegex: null };
  isPromocodeField: boolean = false;
  isPlanSelected:boolean;
  pricingPlanList: PricingPlan[];
  openButtonFlag = false;
  show:boolean;
  showAddFlag = false;
  rebateAmount = 0;
  promotionPercent = 0;
  planId;
  pCode
  pverify:boolean=false;
  customerDto = new CustomerDto();
  promotionMessage = '';
  verifiedPromotionCode = '';
  isPromotionCodeVerifyFail = false;
  popupDelayTimeout = null;
  postalCodeOverlayShowUp = {
    firstOverlay: false,
    secondOverlay: false,
    thirdOverlay: false,
    successOverlay: false,
    failedOverlay: false,
    submitSuccessOverlay: false
  };
  planTypes = {
    id : 0,
    energy: "",
    discount: "",
    rate: "",
    afterGst: "",
    rateChange: "",
  };
  listPricePlanByRefOrProCode = LIST_PRICE_PLAN_BY_REF_OR_PRO_CODE;
  inputSubmissionAllowedClickOn = ['postalCodeVerification', 'submissionForm', 'submissionSuccess'];
  potentialCustomer: PotentialCustomer = null;
  planList: Array<PlanBean>;
  plans: Array<string>;
  promocodeStatus = false;
  promoCode = [{ referralCode: "" }];
  public i: number = 0;
  pdfSrc: any;
  verifiedPromocodes = [];
  adminMessage: any;
  duplicatePromoCode: boolean;
  verified: boolean;
  modalRef: BsModalRef;
  selectData;
  fileName: string;
  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    public modalService: BsModalService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private pricingPlanService: PricingPlanService,
    private localStorage: LocalStorage,
    private utilService: UtilService,
    private gtagService: GoogleTagManagerService,
    configService: ConfigService,
    private service: ApiServiceServiceService,
    private toster: ToastrService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
    this.config.bootstrap = configService.get('bootstrap');
    this.config.dateTimeFormat = configService.get('dateTimeFormat');
    this.config.validationRegex = configService.get('validationRegex');
    this.potentialCustomer = new PotentialCustomer();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    let originalElement = targetElement;
    if (this.inputSubmissionAllowedClickOn.includes(targetElement.id)) {
      return;
    } else {
      let i = 0;
      while (i < 5 && targetElement.parentElement) {
        if (this.inputSubmissionAllowedClickOn.includes(targetElement.parentElement.id)) {
          return;
        }
        i++;
        targetElement = targetElement.parentElement;
      }
    }
    if (this.postalCodeOverlayShowUp.successOverlay) {
      this.postalCodeOverlayShowUp.successOverlay = false;
      return;
    }
    if (this.postalCodeOverlayShowUp.failedOverlay) {
      this.postalCodeOverlayShowUp.failedOverlay = false;
      return;
    }
    if (this.postalCodeOverlayShowUp.submitSuccessOverlay) {
      this.postalCodeOverlayShowUp.submitSuccessOverlay = false;
      return;
    }

    // let j = 0;
    // while (j < 4 && originalElement) {
    //   if (this.postalCodeOverlay.nativeElement.id === originalElement.id) {
    //     if (this.postalCodeOverlayShowUp.firstOverlay) {
    //       this.postalCodeOverlayShowUp.firstOverlay = false;
    //     }
    //     this.postalCodeOverlayShowUp.secondOverlay = !this.postalCodeOverlayShowUp.secondOverlay;
    //     return;
    //   }
    //   j++;
    //   originalElement = originalElement.parentElement;
    // }

    if (this.postalCodeOverlayShowUp.secondOverlay) {
      if (_.size(this.potentialCustomer.postalCode) === 6) {
        this.preValidatePostalCode();
      } else {
        this.postalCodeOverlayShowUp.secondOverlay = false;
      }
    }
  }

  preValidatePostalCode() {
    if (_.size(this.potentialCustomer.postalCode) < 6 || !Number(this.potentialCustomer.postalCode)) {
      this.popover.first.isOpen = !this.popover.first.isOpen;
    } else {
      this.verifyPostalCode();
    }
  }

  isValidMobileNo(): boolean {
    const mobileNoPattern = new RegExp(this.config.validationRegex.mobileNo);
    if (!this.potentialCustomer || _.isEmpty(this.potentialCustomer.mobile) || !mobileNoPattern.test(this.potentialCustomer.mobile)) {
      return false;
    }
    return true;
  }

  isValidEmailAddress(): boolean {
    const emailPattern = new RegExp(this.config.validationRegex.email);
    if (!this.potentialCustomer || _.isEmpty(this.potentialCustomer.email) || !emailPattern.test(this.potentialCustomer.email)) {
      return false;
    }
    return true;
  }

  onPostalCodeChanged(event: any) {
    if (event.key === 'Enter') {
      this.preValidatePostalCode();
    }
  }

  verifyPostalCode() {
    const postalCodePattern = new RegExp(this.config.validationRegex.postalCode);
    const inputPostalCode = this.potentialCustomer.postalCode;
    if (!postalCodePattern.test(inputPostalCode)
      || (!moment().isSameOrAfter('2019-05-01') && !_.inRange(+inputPostalCode.substring(0, 2), 34, 84))
      || (moment().isSameOrAfter('2019-05-01') && !_.inRange(+inputPostalCode.substring(0, 2), 1, 84))) {
      this.postalCodeOverlayShowUp.failedOverlay = true;
      this.postalCodeOverlayShowUp.secondOverlay = false;
      this.postalCodeOverlayShowUp.successOverlay = false;
    } else {
      this.postalCodeOverlayShowUp.secondOverlay = false;
      this.postalCodeOverlayShowUp.successOverlay = true;
      this.potentialCustomer = new PotentialCustomer();
      setTimeout(() => {
        this.postalCodeOverlayShowUp.successOverlay = false;
      }, 30000);
    }
  }

  registContact() {
    this.potentialCustomer.remark = 'the postal code is not supported';
    this.utilService.registContact(this.potentialCustomer).subscribe((rs: SuccessResponse) => {
      this.potentialCustomer = new PotentialCustomer();
      this.postalCodeOverlayShowUp.failedOverlay = false;
      this.postalCodeOverlayShowUp.submitSuccessOverlay = true;
      setTimeout(() => {
        this.postalCodeOverlayShowUp.submitSuccessOverlay = false;
      }, 30000);
    }, () => {
      this.postalCodeOverlayShowUp.failedOverlay = false;
    });
  }

  ngOnInit() {

  
    this.modal.open(this.advisory, 'lg', {
      class: 'mt-5 pt-5 ml-2 mr-2 ml-md-5 mr-md-5 unselect modal-mg-3rem',
      ignoreBackdropClick: true
    });
    setTimeout(() => {
      this.parent.model.premise.productName = null;
    }, 100);
    this.verifiedPromotionCode = (this.parent.model.referralCode || '');

    this.pricingPlanService.fetchAll().subscribe(collection => {
      if (!this.parent.isAdvisoryAgreed) {
        
      
      }
      this.parent.model.premise.serviceNo = '';
      this.pricingPlanList = collection.items;
      const pricingPlan = _.get(this.activateRoute.snapshot.queryParams, 'plan');
      if (pricingPlan) {
        const index = _.findIndex(this.pricingPlanList, plan => _.isEqual(plan.prefillUrl, pricingPlan));
        if (index >= 0) {
          this.parent.model.premise.productName = this.pricingPlanList[index].name;
          this.gtagService.sendEvent(this.pricingPlanList[index].name);
        }
      } else {
        const index = _.findIndex(this.pricingPlanList, plan => _.isEqual(plan.name, this.parent.model.premise.productName));
        if (index >= 0) {
          this.gtagService.sendEvent(this.parent.model.premise.productName);
        }
      }
    })
    this.getPlans();
    this.getAdminMessage();
  }

  hidePdfViewFactSheetModal() {
    this.pdfViewFactSheetModal.hide();
  }



  showPdfViewFactSheetModal() {
    this.pdfViewFactSheetModal.show();
  }


  ngOnDestroy(): void {

    this.pdfSrc = null;
    if (this._pdf) {
      this._pdf.destroy();
    }

  }


  
  getPlans() {
    this.service.get_service(ApiServiceServiceService.apiList.customerViewPlanUrl).subscribe((response) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      this.planList = responseData;
    })
  }

  viewFactSheet() {
    this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet
      + "?planName=" + (btoa(this.planName))).subscribe(response => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
         responseData = responseData.FILE_CONTENT;  
        this.fileName = responseData.FILE_NAME;   
        var data = "data:application/pdf;base64," + responseData;
        this.pdfSrc = data;
      })
    this.pdfViewFactSheetModal.show();

  }

 
  
  onSelectPricingPlanChange(event) {
    this.selectData = event.target.value;
    this.isPlanSelected = true;
    this.openButtonFlag = true;    
    let element = this.planList.find(item => item.planName == this.selectData );  
        try{
          this.planTypes.id = element['id'];                  
        }
        catch(e){
        }

      if (this.parent.model.premise.referral && this.parent.model.premise.referral.length > 0) {
        this.verifyPromotionCode(this.parent.model.premise.referral)
        this.openButtonFlag = true;
    }
    else {
      if (this.selectData) {
        this.openButtonFlag = true;
      }
      else {
        this.openButtonFlag = false;
      }
    }
  }
  verifyPromotionCode(promocode) {
    this.pCode = promocode;
    this.planId = this.planTypes.id
    if (this.planId == undefined) {
      this.planId = ""
    }
    this.service.post_service(ApiServiceServiceService.apiList.verifyPromoUrl + "?promoCode="
      + this.pCode + "&planId=" + btoa(this.planId), this.customerDto).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        var responseMessage = responseBody['message'];
        let statusCode = responseBody['statusCode']
        if (statusCode == 200) {
          this.promocodeStatus = true;
          this.promotionMessage = responseData;
          this.verifiedPromocodes = []; //clear promo code list
          this.verifiedPromocodes.push(promocode)
          this.verified = true;
          this.duplicatePromoCode = false;
          this.isPromocodeField = false;

        }
        else if (statusCode == 400 && responseMessage == "Please select plan for Promo Code." &&  
        this.parent.model.premise.referral.length > 0 ) {
         
            this.promotionMessage = responseMessage;

        }
        else if (statusCode == 400 && responseMessage == "Please select plan for Promo Code." &&  
        this.parent.model.premise.referral == "" ) {         
            this.promotionMessage = null;
            this.verifiedPromocodes = [];

        }
        else if (statusCode == 404 && responseMessage == "Please enter a valid promo/referral code." &&  
        this.parent.model.premise.referral == "" ) {         
            this.promotionMessage = null;
        }
        else if(statusCode == 404 && this.parent.model.premise.referral.length > 0) {
          this.promocodeStatus = false;
          this.promotionMessage = responseMessage;
          this.verifiedPromocodes = [];  //Clear promo code list     
          this.isPromocodeField = false;
        }
        else if (statusCode == 400 && responseMessage == "Promo code is not valid for this plan.") {
            this.promotionMessage = responseMessage;
            this.promocodeStatus=false;
            this.verifiedPromocodes = [];

        }
        else {
          this.promotionMessage = responseMessage;
          this.promocodeStatus = false;
        }
      })
  }

 
  onSubmit(form) {
    this.service.get_service(ApiServiceServiceService.apiList.getSpAccountUrl + "?spAccount=" + this.serviceNos)
      .subscribe((response: any) => {
        var responseBody = response['body'];
        var responseMessage = responseBody['message'];
        let statusCode = responseBody['statusCode']
        if (statusCode == 200) {
          if (this.parent.model.premise.referral == undefined || this.parent.model.premise.referral == "") {
            this.save(form);
        }
        else {
          this.verifyPromotionCode(this.pCode);  
          setTimeout(()=>{
          if(this.promocodeStatus){
            this.save(form);
           
          }
        
       }, 1000)
        
        }
      }
        else { 
          this.toster.error('', responseMessage, {
            timeOut: 3000
          })
        }
      
      
      })
  }
  

  save(form:NgForm){  
    if (form.valid && this.verifiedPromocodes){
      this.parent.model.premise.startDate = moment(new Date()).add('days', 8).format(this.config.bootstrap.datePicker.dateInputFormat);
      this.localStorage.setItem(STORAGE_KEYS.IS_SP_ACCOUNT_HOLDER, this.parent.isSPAccountHolder).subscribe();
      const selectedPricingPlan = _.find(this.pricingPlanList, { name: this.parent.model.premise.productName });
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ENTER_YOUR_DETAIL_1);
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "PALN_DETAILS"
      this.customerDto.spAccountNumber = form.value.serviceNo;
      this.customerDto.plan = form.value.productName;
      this.customerDto.promoCode = this.verifiedPromocodes;
      this.customerDto.selfSignup = this.parent.isSPAccountHolder;      
      this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl, timeStampDto).subscribe((response) => {
        let responseBody = response['body']
        let responseData = responseBody['data']
        let responseToken = responseData['token'];
        localStorage.setItem("Token", responseToken);
        this.customerDto.token = responseToken;
        localStorage.setItem("customerObj", JSON.stringify(this.customerDto));
        form.resetForm();

      })
      this.parent.saveAndNext();
    }
  }

  

  delayedPopover(pop) {
    this.popupDelayTimeout = setTimeout(() => {
      pop.show();
    }, 2000);
  }

  stopPopover(pop) {
    if (this.popupDelayTimeout) {
      clearTimeout(this.popupDelayTimeout);
      pop.hide();
    } else {
      setTimeout(() => {
        pop.hide();
      }, 500);
    }
  }

  closeAdvisoryModal() {
    this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ACK_ADVISORY);
    this.postalCodeOverlayShowUp.firstOverlay = true;
    this.modal.hide();
  }

 
  getAdminMessage() {
    this.service.get_service(ApiServiceServiceService.apiList.getMessageUrl).subscribe((response) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      if(responseData == ''){
      }
      else{
        this.show=true
      this.adminMessage = responseData
      }
    })
  }

  keyPress(event: any) {
    const pattern = /[0-9\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode != '0') {
      event.preventDefault();
    }
  }
}

