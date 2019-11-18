import { TimeStampEvent } from './../../../time-stamp-event.enum';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { SubscriberDataBean } from './../../../subscriber-data-bean';
import { Component, OnInit, Host, ViewChild, HostListener, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';

import { LocalStorage } from '@ngx-pwa/local-storage';

import { OrderComponent } from '../order.component';
import { STORAGE_KEYS, ORDER_GA_EVENT_NAMES } from '../order.constant';
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
import { TimeStampDto } from '@app/sign-up/admin/dto/time-stamp-dto';
import { CustomerDto } from '@app/core/customer-dto';
declare var $:any;
const LIST_PRICE_PLAN_BY_REF_OR_PRO_CODE = {
  '50XMAS18': [ 'SUNSEAP-ONE_DOT_12MTHS', 'SUNSEAP-ONE_DOT_24MTHS', 'SUNSEAP-50_DOT', 'SUNSEAP-100_DOT', 'SUNSEAP-ONE_FIX_12MTHS',
    'SUNSEAP-ONE_FIX_24MTHS', 'SUNSEAP-50_FIX', 'SUNSEAP-100_FIX' ]
};

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
})
export class PlanDetailComponent implements OnInit {
  planName:string = '';
  @ViewChild('advisory') advisory: any;
  @ViewChild('postalCodeOverlay') postalCodeOverlay: any;
  @ViewChildren('popover') popover: any;

  config = { bootstrap: null, dateTimeFormat: null, validationRegex: null };

  pricingPlanList: PricingPlan[];
  openButtonFlag = false;
  showAddFlag=false;
  rebateAmount = 0;
  promotionPercent = 0;
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
  listPricePlanByRefOrProCode = LIST_PRICE_PLAN_BY_REF_OR_PRO_CODE;
  inputSubmissionAllowedClickOn = ['postalCodeVerification', 'submissionForm', 'submissionSuccess'];
  potentialCustomer: PotentialCustomer = null;
  planList:Array<PlanBean>;
  plans:Array<string>;

  public promoCode:any[] = [{referralCode:""}];
  pdfSrc: any;


  getPdf()
{
  this.pricingPlanList;
}  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private pricingPlanService: PricingPlanService,
    private localStorage: LocalStorage,
    private utilService: UtilService,
    private gtagService: GoogleTagManagerService,
    configService: ConfigService,
    private service:ApiServiceServiceService,
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

    let j = 0;
    while (j < 4 && originalElement) {
      if (this.postalCodeOverlay.nativeElement.id === originalElement.id) {
        if (this.postalCodeOverlayShowUp.firstOverlay) {
          this.postalCodeOverlayShowUp.firstOverlay = false;
        }
        this.postalCodeOverlayShowUp.secondOverlay = !this.postalCodeOverlayShowUp.secondOverlay;
        return;
      }
      j++;
      originalElement = originalElement.parentElement;
    }

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
    // Postal codes with the 2 first degits between 01 and 33 and after 1 May 2018 will be allowed
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
    setTimeout(() => {
    this.parent.model.premise.productName = null;
    },100);
    this.verifiedPromotionCode = (this.parent.model.referralCode || '');

    this.service.get_service(ApiServiceServiceService.apiList.customerViewPlanUrl).subscribe((response)=>{
      var responseData  = response;
      var resultObject = responseData['data'];
      this.planList = resultObject;
      this.plans = this.planList.map(plan =>plan.planName);
      
    })

  
    this.pricingPlanService.fetchAll().subscribe(collection => {
      if (!this.parent.isAdvisoryAgreed) {
        setTimeout(() => {
          this.modal.open(this.advisory, 'lg', { class: 'mt-5 pt-5 ml-2 mr-2 ml-md-5 mr-md-5 unselect modal-mg-3rem',
            ignoreBackdropClick: true });
        }, 1000);
      }
      this.parent.model.premise.serviceNo='';
      this.pricingPlanList = collection.items;
      console.log("selected list",this.pricingPlanList);
      
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
}

 
  
viewFactSheet(){
  this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet+"?planName="+this.planName).subscribe(response=>{
    console.log(response);
    var data = "data:application/pdf;base64," +response['data']
    this.pdfSrc = data;
    $("#myModal").modal("show")
   
  })
}
    
  onSelectPricingPlanChange(event) {
    let selectData = event.target.value;
    if(selectData) {
      this.openButtonFlag = true;
    }
    else { 
      this.openButtonFlag = false;
    } 
    // this.parent.model.premise.productName = name;
    // const pricingPlan = _.find(this.pricingPlanList, { name: name });
    // const eventName = _.get(pricingPlan, 'name');
    // const queryParams: Params = Object.assign({}, this.activateRoute.snapshot.queryParams);
    // queryParams[ 'plan' ] = _.get(pricingPlan, 'prefillUrl');
    // this.router.navigate(['.'], { queryParams: queryParams, replaceUrl: true });
    // this.parent.model.premise.contractDuration = _.get(pricingPlan, 'subscription');
    // this.parent.model.premise.planId = _.get(pricingPlan, 'id');
    // this.parent.model.premise.cleanEnergyPercentage = _.get(pricingPlan, 'activePricingPlanRate');
    // if (name) {
    //   this.openButtonFlag=true;
    //   this.gtagService.sendEvent(eventName);

    // }else{
    //   // debugger
    //   this.openButtonFlag=false;
    // }
    // this.parent.model.referralCode = '';
    // this.verifiedPromotionCode = '';
    // this.isPromotionCodeVerifyFail = false;
  }


  verifyPromotionCode() {
    this.showAddFlag=!this.showAddFlag
    let { referralCode } = this.parent.model;
    if (!referralCode) {
      referralCode = '';
    }
    if (_.size(this.listPricePlanByRefOrProCode[ referralCode.trim().toUpperCase() ]) > 0
      && !this.listPricePlanByRefOrProCode[ referralCode.trim().toUpperCase() ]
        .includes(this.parent.model.premise.productName.toUpperCase())) {
      this.isPromotionCodeVerifyFail = true;
      return;
    }
    this.utilService.verifyPromotionCode(referralCode.trim().toLocaleUpperCase())
      .subscribe((rs: SuccessResponse) => {

        this.rebateAmount = rs.data.amount.fixed;
        this.promotionPercent = Number(Math.round(Number(rs.data.amount.percent * 100 + 'e' + 2)) + 'e-' + 2);
        if (this.promotionPercent > 0 && this.rebateAmount > 0) {
          this.promotionMessage = this.rebateAmount + '$' + ' and ' + this.promotionPercent + '%';
        } else if (this.rebateAmount > 0) {
          this.promotionMessage = this.rebateAmount > 0 ? this.rebateAmount + '$' : '';
        } else {
          this.promotionMessage = this.promotionPercent > 0 ? this.promotionPercent + '%' : '';
        }

        this.verifiedPromotionCode = referralCode;
        this.isPromotionCodeVerifyFail = false;
      }, (err) => {
        this.isPromotionCodeVerifyFail = true;
        if (err.code === 'E_LIMITED_REFERRAL_CODE') {
          this.promotionMessage = 'Sorry! Promo code fully redeemed';
        } else {
          this.promotionMessage = '';
        }
      });
  }

  onPromotionCodeFocus() {
    this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.REFERRAL_CODE);
  }

  onPromotionCodeBlur() {
    const { referralCode } = this.parent.model;
    if (referralCode && referralCode !== this.verifiedPromotionCode) {
      this.verifiedPromotionCode = '';
    } else {
      this.isPromotionCodeVerifyFail = false;
    }
  }

  isPromotionCodeValid(): boolean {
    return !this.isPromotionCodeVerifyFail && (_.isEmpty(this.parent.model.referralCode) || !_.isEmpty(this.verifiedPromotionCode));
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.isPromotionCodeValid()) {
      this.parent.model.premise.startDate = moment(new Date()).add('days', 8).format(this.config.bootstrap.datePicker.dateInputFormat);
     this.localStorage.setItem(STORAGE_KEYS.IS_SP_ACCOUNT_HOLDER, this.parent.isSPAccountHolder).subscribe();
      const selectedPricingPlan = _.find(this.pricingPlanList, { name: this.parent.model.premise.productName });

      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ENTER_YOUR_DETAIL_1);
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "PALN_DETAILS"
      var customerDto = new CustomerDto();
      customerDto.spAccountNumber = form.value.serviceNo;
      customerDto.plan = form.value.productName;

      console.log("request pay load",timeStampDto);

      this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{
        var responseData  = response;
        var resultObject = responseData['data'];
        var token = resultObject['token'];
        console.log("Token",token);
        localStorage.setItem("Token",token);
        customerDto.token = token;
    

        localStorage.setItem("customerObj",JSON.stringify(customerDto));
        
      })
      
  
      this.parent.saveAndNext();
    }

    //form.resetForm();
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

  addPromoCode(){
    this.promoCode.push({referralCode :''})
    console.log(this.promoCode);
    
  }
  delete(i:number){
    this.promoCode.splice(i,1)
  }
}