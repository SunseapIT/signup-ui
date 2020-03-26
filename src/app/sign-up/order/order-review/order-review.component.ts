import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, ElementRef, Host, OnInit, ViewChild } from '@angular/core';

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
import { ORDER_ROUTES } from '../order.constant';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { CustomerDto } from '@app/core/customer-dto';
import { ReCaptchaV3Service } from 'ngx-captcha';


const POSTAL_CODE_WARNING = 'The postal code you have entered is currently not eligible for the Open Electricity Market. ' +
  'Please refer to <a href="https://www.openelectricitymarket.sg/index.html" target="_blank">EMA\'s site</a> for more information.';
const IDENTIFICATION_EXPIRY_DATE_CONFIG = {
  minMonthsFromToday: 6
};

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit {

  ETC_FEE_OPTIONS = ETC_FEE_OPTIONS;
  IDENTIFICATION_TYPE_OPTIONS = IDENTIFICATION_TYPE_OPTIONS;
  DWELLING_TYPE_OPTIONS = DWELLING_TYPE_OPTIONS;

  @ViewChild('warningModal') warningModal: any;
  // @ViewChild('reviewForm') reviewForm: ElementRef;

  validation = {};
  spFlag = false;
  nameFlag = false;


  serviceAddress = { houseNo: '', level: '', unitNo: '', levelUnit: '', streetName: '', buildingName: '' };
  rebateAmount: number = null;

  selectedPricingPlan: string;
  fullName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber: string;
  houseNumber: string;
  level: string;
  unitNo: string;
  streetName: string;
  buildingName: string;
  servicePostalCode: string;
  dwellingType: string;
  serviceNo: string;
  isLoader: boolean = false;

  model = {};


  acknowledgeConsent: false;
  acknowledgePrivacy: false;

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
  captcha:any ="";
  userFullName: any;
  // siteKey = "6LdKQeMUAAAAADzEAi5eeo9SDqD7X4ZpFtcnYYTu"; // local
  // siteKey ="6Lfe6OMUAAAAAPvSPYaQA8tMBm59F4d6S5Fclqcn";UAT
  siteKey = "6Le8F-QUAAAAANLvdpKtY5jb_RrH2vToFAp4y_M1"


  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    private localStorage: LocalStorage,
    private configService: ConfigService,
    private gtagService: GoogleTagManagerService,
    private router: Router,
    private service: ApiServiceServiceService,
    private toster: ToastrService,
    private reCaptchaV3Service: ReCaptchaV3Service
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
      this.reCaptchaV3Service.execute(this.siteKey, "home", (token) => {
      useGlobalDomain: false
    });
    this.getCustomerDetail();
  }
  handleReset(){}
  handleSuccess(event){
  this.captcha = event;
  }
  handleExpire(){}
  handleLoad(){}

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
        this.modal.open(this.warningModal, 'md', { ignoreBackdropClick: false });
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
    input.value = this.parent.model[fieldName];
    this.reviewMapInput[fieldName] = false;
  }

  cancelUpdateService(fieldName: string, input: any) {
    input.value = this.serviceAddress[fieldName];
    this.serviceAddressMapInput[fieldName] = false;
  }

  cancelUpdatePremise(fieldName: string, input: any) {
    input.value = this.parent.model.premise[fieldName];
    this.premiseMapInput[fieldName] = false;
  }

  updateReview(fieldName: string, input: any) {
    this.parent.model[fieldName] = input.value;
    this.reviewMapInput[fieldName] = false;
  }

  updateService(fieldName: string, input: any) {
    this.serviceAddress[fieldName] = input.value;
    this.serviceAddressMapInput[fieldName] = false;
  }

  updatePremise(fieldName: string, input: HTMLInputElement) {
    this.parent.model.premise[fieldName] = input.value;
    this.premiseMapInput[fieldName] = false;
  }

  onInputChanged(event: any, fieldName: string, input: any) {
    if (event.key === 'Enter') {
      this.validate(fieldName, input);
    }
  }

  editService(fieldName: string, input: any) {
    this.serviceAddressMapInput[fieldName] = true;
    input.focus();
  }

  editPremise(fieldName: string, input: any) {
    this.premiseMapInput[fieldName] = true;
    input.focus();
  }

  editReview(fieldName: string, input: any) {
    this.reviewMapInput[fieldName] = true;
    input.focus();
  }

  getCustomerDetail() {
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    this.selectedPricingPlan = this.customerDto.plan;
    this.fullName = this.customerDto.fullName;
    this.lastName = this.customerDto.lastName;
    this.emailAddress = this.customerDto.eamilAddress;
    this.mobileNumber = this.customerDto.mobileNumber;
    this.houseNumber = this.customerDto.houseNo;
    this.level = this.customerDto.level;
    this.unitNo = this.customerDto.unitNo;
    this.streetName = this.customerDto.streetName;
    this.buildingName = this.customerDto.buildingName;
    this.servicePostalCode = this.customerDto.postelCode;
    this.dwellingType = this.customerDto.dwelingType;
    this.serviceNo = this.customerDto.spAccountNumber;
  }

  onSubmit(form: NgForm) {
    if (this.acknowledgePrivacy && this.acknowledgeConsent && form.valid) {
      this.isLoader = true;
      let objStr = localStorage.getItem("customerObj");
      this.customerDto = JSON.parse(objStr);
      this.customerDto.fullName = this.fullName;
      this.customerDto.lastName = this.lastName;
      this.customerDto.spAccountNumber = this.serviceNo;
      this.customerDto.contentToMarketing = this.parent.checkedConsent;
      this.customerDto.captchaResponse = this.captcha;      
      localStorage.setItem("customerObj", JSON.stringify(this.customerDto));
      this.service.post_service(ApiServiceServiceService.apiList.saveCustomerurl, this.customerDto).subscribe((response) => {
        if (response.body.data) {
          let responseBody = response['body'];
          let responseData = responseBody['data'];
          let responseMessage = responseBody['body']
          this.isLoader = false;
          let statusCode = responseBody['statusCode']
          if (statusCode == 200) {
            this.isLoader = false;
            this.router.navigateByUrl(ORDER_ROUTES.ORDER_CONFIRMATION);
          }
        }
        else {
          this.toster.error('', response.body.message)
          this.isLoader = false;

        }
      })
    } else {
      this.toster.error('', 'Enter the correct details.')
      this.isLoader = false;
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode != '0') {
      event.preventDefault();
    }
  }
}


