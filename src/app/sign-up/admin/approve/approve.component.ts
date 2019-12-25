import { STORAGE_KEYS, ORDER_ROUTES, ORDER_GA_EVENT_NAMES } from './../../order/order.constant';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CustomerDto } from './../../../core/customer-dto';
import { OrderComponent } from './../../order/order.component';
import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService, UtilService, DWELLING_TYPE_OPTIONS, GoogleTagManagerService } from '@app/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap'
import { ThrowStmt } from '@angular/compiler';

declare const $:any;


const POSTAL_CODE_WARNING = 'The postal code you have entered is currently not eligible for the Open Electricity Market. ' +
  'Please refer to <a href="https://www.openelectricitymarket.sg/index.html" target="_blank">EMA\'s site</a> for more information.';
const POSTAL_CODE_ERROR_MESSAGE = 'Thank you for your interest, but we are sorry that we are unable to proceed with your registration.' +
  '<br>' + 'Please register when your ' +
  '<a href="https://www.openelectricitymarket.sg/index.html" target="_blank">postal code becomes eligible for </a>' +
  ', and we look forward to go #GreenerTogether with you soon.';
const POSTAL_CODE_REDIRECT_DELAY = 5000;


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {

   @ViewChild('warningModal') warningModal: any;
  @ViewChild('pickUpModal') pickUpModal: any;

  DWELLING_TYPE_OPTIONS = DWELLING_TYPE_OPTIONS;
  DWELLING_TYPE_EVENT_NAMES = [
    ORDER_GA_EVENT_NAMES.SELECT_HDB1,
    ORDER_GA_EVENT_NAMES.SELECT_HDB3,
    ORDER_GA_EVENT_NAMES.SELECT_HDB4,
    ORDER_GA_EVENT_NAMES.SELECT_HDB5,
    ORDER_GA_EVENT_NAMES.SELECT_CONDO,
    ORDER_GA_EVENT_NAMES.SELECT_TERRACE,
    ORDER_GA_EVENT_NAMES.SELECT_SEMI,
    ORDER_GA_EVENT_NAMES.SELECT_BUNGALOW,
  ];
  
  planList=[];
  approvalData =[];
  p:number=1;
  searchTextSuccess : string;
  totalItems:any;
  currentPage: number=1;
  isLoader:boolean=false;
  openButtonFlag = false;
  showAddFlag=false;
  public i:number=0;
  promotionMessage = '';
  arrow:boolean;
  validLocations = {};
  pickedLocation: string = null;
  selectedPlanIndex:number;

  spFlag:boolean;
  isPlanFlag:boolean;
  isPostalFlag:boolean;
  isDwellingFlag:boolean;
  isPromoCodeFlag:boolean;

  config = { validationRegex: null };
  newServiceAddress = { houseNo: '', level: '', unitNo: '', levelUnit: '', streetName: '', buildingName: '' };


  promocodeStatus = false;
  customerDto = new CustomerDto();
  selectedPricingPlan:string;
  selectedPricingPlanId:number;
  fullName:string;
  lastName:string;
  emailAddress:string;
  mobileNumber:string;
  houseNumber:string;
  level:string;
  unitNo:string;
  streetName:string;
  buildingName:string;
  servicePostalCode:string;
  dwellingType:string;
  serviceNo:string;
  houseNo:string;
  bill_fileName:string;
  authorization_fileName:string;
  opening_letter_fileName:string;
  files=[];
  pdfSrc:any;
  promoCode=[];
  approvalStatus:boolean;
  postalCode:any;
  verifiedPromocodes = [];
  duplicatePromoCode:boolean;
   arrowPlan:boolean;
 arrowPersonal:boolean;
 arrowAddress:boolean;
 arrowUpload:boolean;
 arrowPlanType:boolean;

   approvalDate:Date;

  sighnUpEndTimeStamp:Date;

  warningMessage = '';
   size = 10;
   page:number = 0;
  customerId: any;
  myDateValue: Date;
 

  constructor(private service:ApiServiceServiceService,
    public parent: OrderComponent,
    public modal: ModalService,
    private dateFormat:DatePipe,
    private localeService: BsLocaleService,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private router: Router,
    private gtagService: GoogleTagManagerService,
    private toastr : ToastrService) {
     
  }

  ngOnInit() {  
  
    this.approvalStatus = this.customerDto.approved
    console.log(' this.approvalStatus', this.approvalStatus);
    
    this.getCustomerForApproval();
    this.getPlans();
    this.postalCode=""
    this.localStorage.getItem(STORAGE_KEYS.SERVICE_ADDRESS)
      .subscribe(newServiceAddress => newServiceAddress && (this.newServiceAddress = newServiceAddress));
      if (this.dwellingType) {
        this.onSelectDwellingType(this.parent.model.premise.dwellingType);
      }  
  }


  getCustomerForApproval(){
    this.isLoader=true;
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl
      +"?size="+this.size+'&page='+this.page).subscribe((responseData:any)=>{
     this.isLoader=false;
      var resultObject = responseData['data'];
      this.totalItems = resultObject.totalElements;
     
      
      var resultObject1 = resultObject['content'];
      this.approvalData = resultObject1;              
    })
 }

 getTimeStamp(time){
  return this.dateFormat.transform(time,"yyyy-MM-dd");
}

  pageChanged(event: any): void {
    this.page = event.page;
    this.getCustomerForApproval();
  }


  onSelectDwellingType(name: string) {
    const dwellingTypes = _.map(DWELLING_TYPE_OPTIONS, (value, key: any) => ({ key: (!isNaN(key)) ? Number(key) : key, value }));
    const index = _.findIndex(dwellingTypes, type => _.isEqual(type.key, name));
    if (index >= 0) {
      this.gtagService.sendEvent(this.DWELLING_TYPE_EVENT_NAMES[index]);
    }
  }

  
 editCustomer(customerList){

  let approved = customerList.approved
  if(approved ==true){
    $('#customer').modal('hide');
    this.toastr.success('', 'Customer already approved.',{
      timeOut: 2000
    })
  }
  else {
  this.selectedPricingPlan = customerList.plan;
  this.promoCode = customerList.promoCode;
  this.fullName = customerList.fullName;
  this.lastName = customerList.lastName;
  this.emailAddress = customerList.eamilAddress;
  this.mobileNumber = customerList.mobileNumber;
  this.houseNo = customerList.houseNo;
  this.level = customerList.level;
  this.unitNo = customerList.unitNo;
  this.streetName= customerList.streetName;
  this.buildingName = customerList.buildingName;
  this.servicePostalCode= customerList.postelCode;
  this.dwellingType = customerList.dwelingType;
  this.serviceNo= customerList.spAccountNumber;
  this.customerId = customerList.customerId;
  if(customerList.files){
    this.bill_fileName= customerList.files.bill_fileName;
    this.authorization_fileName= customerList.files.authorization_fileName;
    this.opening_letter_fileName= customerList.files.opening_letter_fileName;
  }

  this.sighnUpEndTimeStamp = customerList.sighnUpEndTimeStamp.split('-');
  let day = this.sighnUpEndTimeStamp[0];
  let month = this.sighnUpEndTimeStamp[1]-1;
  let year = this.sighnUpEndTimeStamp[2].toString().split(' ')[0];
  let hours = this.sighnUpEndTimeStamp[2].toString().split(' ')[1].toString().split(':')[0];
  let minutes = this.sighnUpEndTimeStamp[2].toString().split(' ')[1].toString().split(':')[1];
  let seconds = this.sighnUpEndTimeStamp[2].toString().split(' ')[1].toString().split(':')[2];
  this.approvalDate =  new Date(year, month, day, hours, minutes, seconds);
  this.approvalDate.setDate(this.approvalDate.getDate() + 5);  
   $('#customer').modal('show');
}
 }



 arrowChange(i){
  if(i == 1){
  this.arrowPlan=!this.arrowPlan;
   }
  else if(i == 2){
  this.arrowPersonal=!this.arrowPersonal;
   }
  else  if(i == 3){
    this.arrowAddress=!this.arrowAddress;
   }
  else if(i == 4){
    this.arrowUpload=!this.arrowUpload;
   }
  else if(i == 5){
  this.arrowPlanType=!this.arrowPlanType;
   }

}

getPlans(){
  this.service.get_service(ApiServiceServiceService.apiList.customerViewPlanUrl).subscribe((response)=>{
    var responseData  = response;
    var resultObject = responseData['data'];
    this.planList = resultObject;   
  })
}

addPromoCode(){
  this.promoCode.push("")   
  this.promotionMessage = ''; 
 }

 delete(i:number){
   this.promoCode.splice(i,1)
 }

 validatePostalCode(code: string) {
  if (_.size(code) > 1 && !this.isPostalCodeValid(code)) {
    this.warningMessage = POSTAL_CODE_WARNING;
    this.modal.open(this.warningModal, 'lg', { ignoreBackdropClick: true });
  } else {
    if (_.size(code) === 6) {
      this.utilService.requestAddresses(code).subscribe(rs => {
        switch (rs.meta.count) {
          case 0:
            this.buildingName = null;
            this.houseNo = null;
            this.streetName = null;
            break;
          case 1:
            this.buildingName = _.upperCase(rs.items[0].building) === 'NIL' ? null : rs.items[0].building;
            this.houseNo = _.upperCase(rs.items[0].blockNo) === 'NIL' ? null : rs.items[0].blockNo;
            this.streetName = _.upperCase(rs.items[0].roadName) === 'NIL' ? null : rs.items[0].roadName;
            break;
          default:
            this.validLocations = {};
            if (_.size(rs.items) > 5) {
              rs.items.splice(0, 5);
            }
            _.forEach(rs.items, (item) => {
              this.validLocations[item.address] = item;
            });
            this.pickedLocation = rs.items[0].address;
            this.modal.open(this.pickUpModal, 'md', { ignoreBackdropClick: false });
            break;
        }
      });
    }
  }
}

isPostalCodeValid(code: string): boolean {
  if (moment().isSameOrAfter('2019-05-01') && _.inRange(+code.substring(0, 2), 1, 84)) {
    return _.inRange(+code.substring(0, 2), 1, 84);
  }
  return _.inRange(+code.substring(0, 2), 34, 84);
}

getCustomerFile(name){
  this.service.get_service(ApiServiceServiceService.apiList.encodeFileUrl
    +"?fileName="+name).subscribe(response=>{  
    var data = "data:application/pdf;base64," +response['data']
    this.pdfSrc = data; 
  })
   $("#myModal").modal("show")
}

onSubmit(form:NgForm){
   this.isLoader=true;  
   if(form.valid){
  var customerDto = new CustomerDto(); 
  customerDto.customerId = this.customerId ;
  customerDto.plan = this.selectedPricingPlan
  customerDto.spAccountNumber= this.serviceNo;
  customerDto.promoCode = this.promoCode;
  customerDto.fullName = this.fullName; 
  customerDto.lastName = this.lastName; 
  customerDto.eamilAddress = this.emailAddress;  
  customerDto.mobileNumber = this.mobileNumber
  customerDto.postelCode = this.servicePostalCode;
  customerDto.houseNo = this.houseNo;
  customerDto.level = this.level;
  customerDto.streetName = this.streetName;
  customerDto.unitNo = this.unitNo;
  customerDto.buildingName = this.buildingName;
  customerDto.dwelingType = this.dwellingType;
  customerDto.files.bill_data = this.customerDto.files.bill_data;
  customerDto.files.authorization_data = this.customerDto.files.authorization_data;
  customerDto.files.factSheet_data = this.customerDto.files.factSheet_data;
  customerDto.approvedTime = this.getTimeStamp(this.approvalDate);
  console.log('data for approval', customerDto);  
  this.service.post_service(ApiServiceServiceService.apiList.approveCustomerUrl, customerDto).subscribe((response)=>{

    var responseData  = response;     
    this.isLoader=false;
      let statusCode = responseData['statusCode']
      if(statusCode == 200){
      this.isLoader=false;
      this.toastr.success('','Customer approved successfully.', {
        timeOut : 2000
      }) 
      $('#customer').modal('hide');
      this.getCustomerForApproval();
      
    }
    else if(statusCode == 400){
      this.isLoader = false; 
      this.toastr.error('','Customer SP Account already exists.', {
        timeOut : 2000
      }) 
      $('#customer').modal('hide');
     
    }
  
  
  

   
})
   }
}

downloadFactSheet(){
  const linkSource = this.pdfSrc;
  const downloadLink = document.createElement("a");
  const fileName = "Letter.pdf";
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

editPromoCode(event,i){
  this.promoCode[i] = event.target.value;  
}

indexTracker(index: number) {
  return index;
}

verifyPromotionCode(index) {
  let promocode = this.promoCode[index].referralCode; 
 
  if(this.verifiedPromocodes.length){

   this.verifiedPromocodes.findIndex(item => item == promocode)
    if(this.verifiedPromocodes.findIndex(item => item == promocode) == -1){
      this.verifyPromocode(promocode);
      this.duplicatePromoCode=false;
    }else{
      this.duplicatePromoCode=true;
    }
  }else{
    this.verifyPromocode(promocode);
    this.duplicatePromoCode=false;
  }
}




verifyPromocode(promocode){  
  var customerDto = new CustomerDto();
  // this.verifiedPromocodes.push(promocode)
  this.service.post_service(ApiServiceServiceService.apiList.verifyPromoUrl+"?promoCode="
  +promocode,customerDto).subscribe((response: any) => {
    var responseData = response;
    if(responseData['statusCode']==200){
      this.promocodeStatus = true;
      this.promotionMessage = response.data;
    
    }
    else{
      this.promocodeStatus = false;
      this.promotionMessage = response.message;
     
    }
  })
}

get selectedPlanType(){
  let planObject ;
  console.log(this.selectedPricingPlan);
  console.log(this.planList);
  
  if(this.selectedPricingPlan!=null &&this.planList!=null){
    for (let index = 0; index < this.planList.length; index++) {
      const element = this.planList[index];
      if(element.planName == this.selectedPricingPlan){
        this.selectedPlanIndex = index;
        planObject = element;
        break;
      }
      
    }
  }
  return planObject;
}


}


