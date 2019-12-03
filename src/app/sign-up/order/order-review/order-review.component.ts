import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import {Component, ElementRef, Host, OnInit, ViewChild} from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';

import {
  ConfigService,
  DWELLING_TYPE_OPTIONS,
  ETC_FEE_OPTIONS, GoogleTagManagerService,
  IDENTIFICATION_TYPE_OPTIONS,
  IdentificationType, ModalService,
  PricingPlan,
  ProductType
} from '@app/core';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES, STORAGE_KEYS, ORDER_ROUTES } from '../order.constant';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Route, Router } from '@angular/router';
import { CustomerDto } from '@app/core/customer-dto';
import { SubscriberDataBean } from '@app/subscriber-data-bean';

const POSTAL_CODE_WARNING = 'The postal code you have entered is currently not eligible for the Open Electricity Market. ' +
  'Please refer to <a href="https://www.openelectricitymarket.sg/index.html" target="_blank">EMA\'s site</a> for more information.';
const IDENTIFICATION_EXPIRY_DATE_CONFIG = {
  minMonthsFromToday: 6
};

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: [ './order-review.component.scss' ]
})
export class OrderReviewComponent implements OnInit {

  ETC_FEE_OPTIONS = ETC_FEE_OPTIONS;
  IDENTIFICATION_TYPE_OPTIONS = IDENTIFICATION_TYPE_OPTIONS;
  DWELLING_TYPE_OPTIONS = DWELLING_TYPE_OPTIONS;

  @ViewChild('warningModal') warningModal: any;
  // @ViewChild('reviewForm') reviewForm: ElementRef;

  validation = {};
  spFlag=false;
  nameFlag=false;


  serviceAddress = { houseNo: '', level: '', unitNo: '', levelUnit: '', streetName: '', buildingName: '' };
  rebateAmount: number = null;

  selectedPricingPlan:string;
  fullName:string;
  emailAddress:string;
  mobileNumber:string;
  houseNumber:string;
  levelUnit:string;
  streetName:string;
  buildingName:string;
  servicePostalCode:string;
  dwellingType:string;
  serviceNo:string;

  model={};


  acknowledgeConsent: false;
  acknowledgePrivacy:false;
  
  checked = true;
  isDotPlan = false;
  reviewMapInput = {};
  serviceAddressMapInput = {};
  premiseMapInput = {};
  IdentificationType = IdentificationType;
  config = { bootstrap: null, validationRegex: null };
  warningMessage = '';
  minExpiryDate = moment(new Date()).add(IDENTIFICATION_EXPIRY_DATE_CONFIG.minMonthsFromToday, 'month').toDate();
  nationName = 'singapore';
   customerDto = new CustomerDto();


  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    private localStorage: LocalStorage,
    private configService: ConfigService,
    private gtagService: GoogleTagManagerService,
    private router:Router,
    private service:ApiServiceServiceService,
    private toster :ToastrService
  ) {
    this.config.bootstrap = configService.get('bootstrap');
    const validationRegex = configService.get('validationRegex');
    this.config.validationRegex = validationRegex;

    this.validation = {
      // identificationNo: { isRequired: true, regex: validationRegex.nricNo, message: 'NRIC No / FIN is invalid.' },
      // serviceNo: { isRequired: true, regex: validationRegex.spAccountNo, message: 'SP No is invalid.' },
      // identificationName: { isRequired: true, regex: null, message: 'Full name is required.' },
      // houseNo: { isRequired: true, regex: validationRegex.blockHouseNo,
      //   message: 'Block/House No is required and contains at least one number.' },
      // streetName: { isRequired: true, regex: null, message: 'Street name is required.' },
      // levelUnit: { isRequired: false, regex: null, message: null },
      // buildingName: { isRequired: false, regex: null, message: null },
      // servicePostalCode: { isRequired: true, regex: validationRegex.postalCode, message: POSTAL_CODE_WARNING },
    };
  }

  ngOnInit() {
   this.getCustomerDetail();

  }

  validate(fieldName: string, input: HTMLInputElement) {
    if (this.validation[fieldName].isRequired) {
      const pattern = this.validation[fieldName].regex ? new RegExp(this.validation[fieldName].regex) : null;
      if (pattern && !pattern.test(input.value) || _.isEmpty(input.value)) {
        this.warningMessage = this.validation[fieldName].message;
        this.modal.open(this.warningModal, 'md', { ignoreBackdropClick: false });
        return;
      }
      if (fieldName === 'servicePostalCode'
        && (!moment().isSameOrAfter('2019-05-01') && !_.inRange(+input.value.substring(0, 2), 34, 84)
        || (moment().isSameOrAfter('2019-05-01') && !_.inRange(+input.value.substring(0, 2), 1, 84)))) {
        this.warningMessage = POSTAL_CODE_WARNING;
        this.modal.open(this.warningModal, 'md', {ignoreBackdropClick: false});
        return;
      }
    }
    if (fieldName in this.parent.model) {
      this.updateReview(fieldName, input);
    }
    if (fieldName in this.parent.model.premise) {
      this.updatePremise(fieldName, input);
    }
    if (fieldName in this.serviceAddress) {
      this.updateService(fieldName, input);
    }
  }

  onExpiryDateChange(value) {
    const date = value ? moment(value).format(this.config.bootstrap.datePicker.dateInputFormat) : '';
    if (date !== this.parent.model.identificationExpiryDate) {
      this.parent.model.identificationExpiryDate = date;
    }
  }

  cancelUpdateReview(fieldName: string, input: any) {
    input.value = this.parent.model[ fieldName ];
    this.reviewMapInput[ fieldName ] = false;
  }

  cancelUpdateService(fieldName: string, input: any) {
    input.value = this.serviceAddress[ fieldName ];
    this.serviceAddressMapInput[ fieldName ] = false;
  }

  cancelUpdatePremise(fieldName: string, input: any) {
    input.value = this.parent.model.premise[ fieldName ];
    this.premiseMapInput[ fieldName ] = false;
  }

  updateReview(fieldName: string, input: any) {
    this.parent.model[ fieldName ] = input.value;
    this.reviewMapInput[ fieldName ] = false;
  }

  updateService(fieldName: string, input: any) {
    this.serviceAddress[ fieldName ] = input.value;
    this.serviceAddressMapInput[ fieldName ] = false;
  }

  updatePremise(fieldName: string, input: HTMLInputElement) {
    this.parent.model.premise[ fieldName ] = input.value;
    this.premiseMapInput[ fieldName ] = false;
  }

  // isExpiryDateValid() {
  //   if ((this.parent.model.identificationType === IdentificationType.EmploymentPass
  //     || this.parent.model.identificationType === IdentificationType.WorkPermit) && _.isEmpty(this.parent.model.identificationExpiryDate)) {
  //     return false;
  //   }
  //   return true;
  // }

  onInputChanged(event: any, fieldName: string, input: any) {
    if (event.key === 'Enter') {
      this.validate(fieldName, input);
    }
  }

  // onIdTypeChanged(idType: string) {
  //   if (!this.isExpiryDateValid()) {
  //     this.warningMessage = 'Expiry date is required.';
  //     this.modal.open(this.warningModal, 'md', { ignoreBackdropClick: false });
  //   }
  // }

  editService(fieldName: string, input: any) {
    this.serviceAddressMapInput[ fieldName ] = true;
    input.focus();
  }

  editPremise(fieldName: string, input: any) {
    this.premiseMapInput[ fieldName ] = true;
    input.focus();
  }

  editReview(fieldName: string, input: any) {
    this.reviewMapInput[ fieldName ] = true;
    input.focus();
  }

  getCustomerDetail(){
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    this.selectedPricingPlan = this.customerDto.plan;
    this.fullName = this.customerDto.fullName;
    this.emailAddress = this.customerDto.eamilAddress;
    this.mobileNumber = this.customerDto.mobileNumber;
    this.houseNumber = this.customerDto.houseNo;
    this.levelUnit ="";
    this.streetName= this.customerDto.streetName;
    this.buildingName = this.customerDto.buildingName;
    this.servicePostalCode= this.customerDto.postelCode;
    this.dwellingType = this.customerDto.dwelingType;
    this.serviceNo= this.customerDto.spAccountNumber;
  }


  onSubmit(form:NgForm) {
    if (this.acknowledgePrivacy && this.acknowledgeConsent) {       
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("customerObj");
      customerDto = JSON.parse(objStr);
      customerDto.fullName = this.fullName; 
      customerDto.spAccountNumber = this.serviceNo;
      localStorage.setItem("customerObj", JSON.stringify(customerDto))
      console.log('Request Object--->',customerDto);
      


    this.service.post_service(ApiServiceServiceService.apiList.saveCustomerurl,customerDto).subscribe((response)=>{
    var responseData  = response;   
    console.log('Response Object----->',responseData);
     
    if(responseData['statusCode']==200){
      localStorage.removeItem("customerObj")
      localStorage.removeItem("Token")
      this.router.navigateByUrl(ORDER_ROUTES.ORDER_CONFIRMATION);

    }else{
      this.toster.error('',responseData['message'], {
        timeOut : 3000
      })
    }
  })
}
else{
  this.toster.error('','Please select the mandatory checkboxes.', {
    timeOut : 3000
  })
}
  }

 

  
  }

