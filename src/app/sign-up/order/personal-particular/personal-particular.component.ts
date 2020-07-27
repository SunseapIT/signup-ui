import { CustomerDto } from './../../../core/customer-dto';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, Host, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IdentificationType, ConfigService, UtilService, IDENTIFICATION_TYPE_OPTIONS, ModalService, GoogleTagManagerService } from '@app/core';
import { OrderComponent } from '../order.component';
import { STORAGE_KEYS, ORDER_ROUTES, ORDER_GA_EVENT_NAMES } from '../order.constant';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TimeStampDto } from '@app/core/time-stamp-dto';
declare var $: any
const IDENTIFICATION_EXPIRY_DATE_CONFIG = {
  minMonthsFromToday: 6
};
const OTP_SEND_LIMIT = 5;


@Component({
  selector: 'app-personal-particular',
  templateUrl: './personal-particular.component.html',
})
export class PersonalParticularComponent implements OnInit {

  @ViewChild('mobileRC') mobileReCaptcha: RecaptchaComponent;

  IdentificationType = IdentificationType;
  IDENTIFICATION_TYPE_OPTIONS = IDENTIFICATION_TYPE_OPTIONS;

  @ViewChild('validateOTP') validateOTP: any;

  config = { bootstrap: null, validationRegex: null };

  minExpiryDate = moment(new Date()).add(IDENTIFICATION_EXPIRY_DATE_CONFIG.minMonthsFromToday, 'month').toDate();

  confirmEmailValue = '';

  mobileVerification = {
    otpMobile: '',
    messageId: '',
  };

  emailVerification = {
    otp: '',
    messageId: '',
  };

  verificationProgress: 'pending' | 'doing' | 'success' | 'fail' = 'pending';

  verificationFailCount = 0;

  errorMessage = '';
  warningMessage = '';

  verifiedMobileNo = '';
  verifiedEmail = '';
  recaptchaResponse = '';
  otp: any;
  otpMobile: any;
  mobileOtpError: any;
  mobileOtpStatus: boolean;
  token: any;
  isEmailOtpValidated: boolean = false;
  isMobileOtpValidate: boolean = false;
  customerDto = new CustomerDto();


  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private gtagService: GoogleTagManagerService,
    configService: ConfigService,
    private service: ApiServiceServiceService,
    private toster: ToastrService) {
    this.config.bootstrap = configService.get('bootstrap');
    this.config.validationRegex = configService.get('validationRegex');
  }

  ngOnInit() {
    this.localStorage.getItem<number>(STORAGE_KEYS.VERIFYING_OTP_COUNT).subscribe(count => {
      this.verificationFailCount = count || 0;
    });
  }

  onExpiryDateChange(value) {
    const date = value ? moment(value).format(this.config.bootstrap.datePicker.dateInputFormat) : '';
    if (date !== this.parent.model.identificationExpiryDate) {
      this.parent.model.identificationExpiryDate = date;
    }
  }


  isMobileNoVerified() {
    return (this.verifiedMobileNo === this.parent.model.mobileNo)
  }

  isEmailVerified() {
    return (this.verifiedEmail === this.parent.model.email)
  }
  isOTPExpired(): boolean {
    return this.verificationFailCount >= OTP_SEND_LIMIT;
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.isMobileOtpValidate && this.isEmailOtpValidated) {
      if (!_.includes([IdentificationType.EmploymentPass, IdentificationType.WorkPermit], this.parent.model.identificationType)) {
        this.parent.model.identificationExpiryDate = '';
      }
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ENTER_YOUR_DETAIL_2);
      var objStr = localStorage.getItem("customerObj");
      this.customerDto = JSON.parse(objStr);
      this.customerDto.fullName = this.parent.model.identificationName;
      this.customerDto.eamilAddress = this.parent.model.email.toLowerCase();
      this.customerDto.mobileNumber = this.parent.model.mobileNo;
      this.customerDto.lastName = this.parent.model.lastName
      localStorage.setItem("customerObj", JSON.stringify(this.customerDto))
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "PERSONAL_DETAILS",
        timeStampDto.token = localStorage.getItem("Token")
      this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl, timeStampDto).subscribe((response) => {
      })
      this.parent.saveAndNext();
      form.resetForm();
    }
  }

  requestEmailOTP(verifyEmail) {
    this.verificationProgress = 'pending';
    this.errorMessage = '';
    this.emailVerification.otp = '';
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    this.verifiedEmail = this.parent.model.email;
    this.token = this.customerDto.token;
    this.service.post_service(ApiServiceServiceService.apiList.sendEmailOtp + "?token=" + this.token + "&email=" + this.verifiedEmail, null)
      .subscribe((response) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        var responseMessage = responseBody['message'];
        let statusCode = responseBody['statusCode']
        if (statusCode == 200) {
        if (verifyEmail) {
          $('#emailOTP').modal('show');
        }
        else {
          this.toster.success('', 'OTP has been resent to Email Address', {
          
          });
          this.otp = ''
        }
      }
      else if(statusCode == 400){
        $('#emailOTP').modal('hide');
        this.toster.error('', responseMessage, {        
        });
        this.parent.model.email="";
      this.parent.model.identificationName="";
      this.parent.model.lastName=""
      this.parent.model.mobileNo=""
        localStorage.removeItem("customerObj")
        localStorage.removeItem("Token")
        this.parent.isAdvisoryAgreed = false;
        this.router.navigateByUrl('');
      }
      else{
        this.toster.error('', responseMessage, {   
        });
      }
      });
  }


  validateEmailOTPModal() {
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    var token = this.customerDto.token;
    var email = this.parent.model.email;
    this.service.get_service(ApiServiceServiceService.apiList.getEmailOtp + "?token=" + token + "&email=" + email + "&otp=" + this.otp).subscribe((response) => {
      var responseBody = response['body'];
      let statusCode = responseBody['statusCode']
      if (statusCode == 200) {
        this.isEmailOtpValidated = true;
        $("#emailOTP").modal('hide');
        this.toster.success('', 'Email successfully verified', {
          timeOut: 3000
        });
      }
      else {
        this.isEmailOtpValidated = false;
        this.toster.error('', 'OTP has expired, please try again.', {
          timeOut: 3000
        });
      }
    })
  }


  requestMobileOTP(verifyMobile) {
    this.verificationProgress = 'pending';
    this.errorMessage = '';
    this.emailVerification.otp = '';
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    this.token = this.customerDto.token;
    this.verifiedMobileNo = this.parent.model.mobileNo;
    this.service.post_service(ApiServiceServiceService.apiList.sendMobileOtp + "?token=" + this.token +
      "&mobileNumber=" + this.verifiedMobileNo, null)
      .subscribe((response) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        var responseMessage = responseBody['message'];
        let statusCode = responseBody['statusCode']
        if (statusCode == 200) {
        if (verifyMobile) {
          $('#mobileOTP').modal('show')
        }
        else {
          this.toster.success('', 'OTP has been resent to Mobile Number', {
            timeOut: 3000
          });
          this.otpMobile = ''
        }
      }
      else if(statusCode == 400){
        $('#mobileOTP').modal('hide')
        this.toster.error('', responseMessage, {        
        });
        this.parent.model.email="";
        this.parent.model.identificationName="";
        this.parent.model.lastName=""
        this.parent.model.mobileNo=""
       
        localStorage.removeItem("customerObj")
        localStorage.removeItem("Token")
        this.parent.isAdvisoryAgreed = false;
        this.router.navigateByUrl('');

      }
      else{
        this.toster.error('', responseMessage, {   
        });
      }
      });
  }

  //Validate mobile OTP
  validateMobileOTPModal() {
    var objStr = localStorage.getItem("customerObj");
    this.customerDto = JSON.parse(objStr);
    var token = this.customerDto.token;
    var mobileNumber = this.parent.model.mobileNo;
    this.service.post_service(ApiServiceServiceService.apiList.verifyMobileUrl + "?mobileNumber="
      + mobileNumber + "&otp=" + this.otpMobile + "&token=" + token, null).subscribe((response) => {
        var responseBody = response['body'];
        let statusCode = responseBody['statusCode']
        if (statusCode == 200) {
          this.isMobileOtpValidate = true;
          $("#mobileOTP").modal('hide');
          this.toster.success('', 'Mobile Number successfully verified', {
            timeOut: 3000
          });
        }
        else {
          this.isMobileOtpValidate = false;
          this.toster.error('', 'OTP has expired, please try again.', {
            timeOut: 3000
          });
        }
      })
  }
}
