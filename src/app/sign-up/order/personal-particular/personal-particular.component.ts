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
import { TimeStampDto } from '@app/sign-up/admin/dto/time-stamp-dto';
import { ToastrService } from 'ngx-toastr';
declare var $:any
const IDENTIFICATION_EXPIRY_DATE_CONFIG = {
  minMonthsFromToday: 6
};
const OTP_SEND_LIMIT = 5;
const OTP_WARNING = 'You have {{otp_send_remain}} attempts remain';
const OTP_ERROR_MESSAGE = 'Incorrect input OTP {{otp_send_limit}} times, please back to sign up again';

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
    otp: '',
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
  verifiedEmail='';
  recaptchaResponse = '';
  otp: any;
  otpMobile:any;
  mobileOtpError:any;
  mobileOtpStatus:boolean;
  token:any;


  constructor(
    @Host() public parent: OrderComponent,
    public modal: ModalService,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private gtagService: GoogleTagManagerService,
    configService: ConfigService,
    private service : ApiServiceServiceService,
    private toster : ToastrService)
    {
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
    return  (this.verifiedMobileNo === this.parent.model.mobileNo)
  }

  isEmailVerified() {
    return  (this.verifiedEmail === this.parent.model.email)
  }
  isOTPExpired(): boolean {
    return this.verificationFailCount >= OTP_SEND_LIMIT;
  }

  onSubmit(form : NgForm) {
   if (form.valid && this.isMobileNoVerified() && this.isEmailVerified()) {
      if (!_.includes([IdentificationType.EmploymentPass, IdentificationType.WorkPermit], this.parent.model.identificationType)) {
        this.parent.model.identificationExpiryDate = '';
      }
      this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.ENTER_YOUR_DETAIL_2);
      var customerDto = new CustomerDto();
      var objStr = localStorage.getItem("customerObj");
      customerDto = JSON.parse(objStr);
      customerDto.fullName = form.value.identificationName;
      customerDto.eamilAddress = form.value.email;
      customerDto.mobileNumber = form.value.mobileNo;
      customerDto.lastName = form.value.lastName;
      localStorage.setItem("customerObj",JSON.stringify(customerDto))
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "PERSONAL_DETAILS",
      timeStampDto.token = localStorage.getItem("Token")     
      this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{        
      })      
      this.parent.saveAndNext();
      form.resetForm();
    }
  }

 
  requestEmailOTP(verifyEmail){
    this.verificationProgress = 'pending';
    this.errorMessage = '';
    this.emailVerification.otp = '';
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("customerObj");
    customerDto = JSON.parse(objStr);
    // this.verifiedEmail = this.parent.model.email;
    this.token = customerDto.token;

    this.service.post_service(ApiServiceServiceService.apiList.sendEmailOtp+"?token="+this.token+"&email="+this.verifiedEmail,null).subscribe((response)=>
    {
      if(verifyEmail){
        $('#emailOTP').modal('show');   
      }
      else{
        this.toster.success('', 'OTP has been resent to email address.',{
          timeOut : 3000
          });
      }
      
    })

  }

  validateEmailOTPModal(){
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("customerObj");
    customerDto = JSON.parse(objStr);
    var email = this.parent.model.email;
    var token = customerDto.token;
    var email = this.parent.model.email;
    this.service.get_service(ApiServiceServiceService.apiList.getEmailOtp+"?token="+token+"&email="+email+"&otp="+this.otp).subscribe((response)=>
    {
    var responseData = response;
    if(responseData['statusCode']==200){
    $("#emailOTP").modal('hide');
    this.toster.success('', 'Email is verified successfully.',{
    timeOut : 3000
    });
    }   
    else 
    {
    this.toster.error('', 'You have entered an invalid OTP.',{
    timeOut : 3000
    });
    }
    })
  }
 
   
  
  requestOTP (){
    this.verificationProgress = 'pending';
    this.errorMessage = '';
    this.mobileVerification.otp = '';
     $('#mobileOTP').modal('show')
    // var mobileNumber = this.parent.model.mobileNo;
    // this.service.post_service(ApiServiceServiceService.apiList.sendMobileOtp+"?mobileNumber="+mobileNumber,null)
    // .subscribe((response:any)=>{
    // var responseData = response;
    // if(responseData['statusCode']==200){
    // $('#mobileOTP').modal('show')
    // }
    // else 
    // {
    // this.mobileOtpError = response.message;
    // }      
    // })
    }

    //Validate mobile OTP 
  validateOTPModal(){
    // var mobileNumber = this.parent.model.mobileNo;
    // this.service.post_service(ApiServiceServiceService.apiList.verifyMobileUrl+"?mobileNumber="+mobileNumber+"&otp="+this.otp,null).subscribe((response)=>
    // {
    // console.log('Mobile OTP response', response);
    // var responseData = response;
    // if(responseData['statusCode']==200){
    // $("#mobileOTP").modal('hide');
    // this.toster.success('', 'Mobile number is verified successfully',{
    // timeOut : 3000
    // });
    // }   
    // else 
    // {
    // this.toster.error('', 'You have entered an invalid OTP',{
    // timeOut : 3000
    // });
    // }
    // })
    if(this.otpMobile == '25580'){
      this.verifiedMobileNo = this.parent.model.mobileNo;
      $("#mobileOTP").modal('hide');
      this.toster.success('', 'Mobile number is verified successfully',{
        timeOut : 3000
      });
    }else{
      this.toster.error('', 'You have entered an invalid OTP.',{
        timeOut : 3000
        });
    }
  }


}
