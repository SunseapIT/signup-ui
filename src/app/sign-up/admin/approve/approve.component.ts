
import { CustomerRemark } from './../../../core/services/customer-remark-dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { STORAGE_KEYS, ORDER_GA_EVENT_NAMES } from './../../order/order.constant';
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
declare var require: any
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

  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;

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
  searchTextSuccess : string;
  totalItems:any;
  currentPage: number=1;
  isLoader:boolean=false;
  public i:number=0;
  promotionMessage = '';
  validLocations = {};
  pickedLocation: string = null;
  selectedPlanIndex:number;
  verified : boolean;
  sortParams="fullName"
  sort = 'asc';
  sortingValue=[true,true,true,true]

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
  remarks:string;
  pdfSrc:any;
   promoCodeList:any[]=[];
  approvalStatus:boolean;
  postalCode:any;
  country:string;
  verifiedPromocodes:any[]=[];
  duplicatePromoCode:boolean;
   arrowPlan:boolean;
 arrowPersonal:boolean;
 arrowAddress:boolean;
 arrowUpload:boolean;
 arrowPlanType:boolean;
 approvedDate:any;
 promoCode:any;
 finalApproved = {}

 approvedCustomerData=[];
  
   approvalDate:Date;

  sighnUpEndTimeStamp:Date;

  warningMessage = '';
   size = 10;
   page:number = 0;
  customerId: any;
  myDateValue: Date;
  planType =[];
  lastApproveDate: Date;
 

  constructor(private service:ApiServiceServiceService,
    public parent: OrderComponent,
    public modal: ModalService,
    private dateFormat:DatePipe,
    private localeService: BsLocaleService,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private router: Router,
    private modalService: BsModalService,
    private gtagService: GoogleTagManagerService,
    private toastr : ToastrService) {
     
  }

  ngOnInit() {  
    this.approvalStatus = this.customerDto.approved
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
      +"?size="+this.size+'&page='+(this.page-1)+"&sort="+this.sortParams+','+this.sort).subscribe((responseData:any)=>{
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

  approvedCustomer(customerList){
    this.selectedPricingPlan = customerList.plan;
    //prepopulate selected value
    this.selectPlans(this.selectedPricingPlan);
    this.promoCode = customerList.promoCode;
    this.verifiedPromocodes=null
    if(customerList.promoCode == null){
      this.verifiedPromocodes=[];
    }
    else{
      this.verifiedPromocodes=customerList.promoCode;
    }

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
    this.remarks = customerList.remarks;
    this.country= customerList.country;
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
  }

 
 editCustomer(customerList){
  let approved = customerList.approved
  if(approved ==true){
    this.approvedCustomer(customerList)  
    this.lastApproveDate = this.approvalDate 
    $('#approved').modal('show');   
  }
  else {
  this.approvedCustomer(customerList)
  this.lastApproveDate = this.approvalDate
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
  // Postal codes with the 2 first digits between 58 and 78 will be allowed
  return _.inRange(+code.substring(0, 2), 34, 84);}

getCustomerFile(name){
  this.service.get_service(ApiServiceServiceService.apiList.encodeFileUrl
    +"?fileName="+name).subscribe((response:any)=>{  
    var b64toBlob = require('b64-to-blob');
    var file =  b64toBlob(response.data,'application/pdf');
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  })
}


onSubmit(form:NgForm){
  this.isLoader=true;  
   if(form.valid){
  var customerDto = new CustomerDto(); 
  customerDto.customerId = this.customerId ;
  customerDto.plan = this.selectedPricingPlan
  customerDto.spAccountNumber= this.serviceNo;
  customerDto.promoCode = this.verifiedPromocodes;
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
  this.service.post_service(ApiServiceServiceService.apiList.approveCustomerUrl, customerDto)
  .subscribe((response)=>{
    var responseData  = response;  
    this.isLoader=false;
    let msgCode = responseData['message'] 
      let statusCode = responseData['statusCode']
      if(statusCode == 200){
      this.isLoader=false;
      this.toastr.success('','Customer approved successfully.', {
        timeOut : 2000
      }) 
      $('#customer').modal('hide');
      this.getCustomerForApproval();
      
    }
    else if(statusCode == 400 && msgCode== 'installationIdentifier Consumer already exists with provided MSSL number.'){
      this.isLoader = false; 
      this.toastr.error('','This SP account number already exists.', {
        timeOut : 2000
      }) 
      $('#customer').modal('hide');
     
    }   
    else if(statusCode == 400 && msgCode== 'postalPoBox \"Postal PO Box\" is required when Postal Street is set.'){
      this.isLoader = false; 
      this.toastr.error('','This is an invalid service address.', {
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

editPromoCode(event){
  console.log('code',event)

  // console.log('codeeeeeee target',event.target.value);
  
  this.isPromoCodeFlag = !this.isPromoCodeFlag;
  if(event){
    this.promoCodeList=null
    this.promoCodeList=[];

    event.forEach(element => {
      this.promoCodeList.push({
        referralCode: element
      });
    });
  }
  else{
     this.promoCode=this.verifiedPromocodes;
    this.duplicatePromoCode=false;
    this.promotionMessage=''
    

  }
}

indexTracker(index: number) {
  return index;
}

addPromoCode(){
    this.promoCodeList.push({referralCode :''})   
    this.promotionMessage = ''; 
    this.duplicatePromoCode=false;
    this.promocodeStatus=false;
 }


 delete(i:number){    
  if(this.verified){
    this.verifiedPromocodes.splice(i,1);
    this.duplicatePromoCode=false;
    this.promotionMessage='';
  }
  this.promoCodeList.splice(i,1);
  this.duplicatePromoCode=false;
  this.promotionMessage='';
}

verifyPromotionCode(index) {
  let promocode = this.promoCodeList[index].referralCode.toLowerCase(); 
 
  if( this.verifiedPromocodes.length >0){
    this.verified=true;
   this.verifiedPromocodes.findIndex(item => item == promocode)
    if(this.verifiedPromocodes.findIndex(item => item == promocode) == -1){
      this.verifyPromocode(index,promocode);
      this.duplicatePromoCode=false;
    }else{
      this.duplicatePromoCode=true;
    }
  }else{
    this.verifyPromocode(index,promocode);
    this.duplicatePromoCode=false;
  }
}

verifyPromocode(index,promocode){
  var customerDto = new CustomerDto();
  this.service.post_service(ApiServiceServiceService.apiList.verifyPromoUrl+"?promoCode="
  +promocode,customerDto).subscribe((response: any) => {
   var responseData = response;
    if(responseData['statusCode']==200){
      this.promocodeStatus = true;
      this.promotionMessage = response.data;
      this.verifiedPromocodes.push(promocode)
      this.verified=true;
      this.duplicatePromoCode=false;
    }
    else{
      this.promocodeStatus = false;
      this.promotionMessage = response.message;
     
    }
  })
}

selectPlans(value){
  let selectedPlan =value;
  if(selectedPlan !=null){
    for (let index = 0; index < this.planList.length; index++) {
      const element = this.planList[index];
      if(element.planName == selectedPlan){
        this.selectedPlanIndex = index;
        this.planType = element;       
        break;
      }      
    }
  }
}

keyPress(event: any) {
  const pattern = /[0-9\-\ ]/;   
  let inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar) && event.charCode != '0') {
          event.preventDefault();
      }
}


sorting(value, format){
  let pageNumber =0
  if(this.page==0){
    pageNumber=0
  }else{
    pageNumber=this.page-1;
  } 
  this.sort="asc"
  if(format) {
   this.sort = "asc"
  } else {
   this.sort = "desc"
  }
  if(value == 'spAccount' ){
    this.sortParams="spAccountNumberDetails.spAccountNumber";
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+
      "?sort=spAccountNumberDetails.spAccountNumber,"+this.sort+'&page='+pageNumber).subscribe((response:any)=>{
      this.approvalData = response.data.content;     
    })
 }

 
 else if(value == 'address'){
  this.sortParams = 'addressData.buildingName'
   this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl
    +"?sort=addressData.buildingName,"+this.sort+'&page='+pageNumber).subscribe((response:any)=>{
     this.approvalData = response.data.content;
    })
 }
 else if(value == 'name'){
  this.sortParams ='fullName';
   this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+"?sort=fullName,"+this.sort+'&page='+pageNumber).subscribe((response:any)=>{
     this.approvalData = response.data.content;
   })
 } 
else if(value == 'final'){
  this.sortParams = 'TimestampRecords.signUp'
  this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+"?sort=TimestampRecords.signUp,"+this.sort+'&page='+pageNumber).subscribe((response:any)=>{
    this.approvalData = response.data.content;
  })
}
else if(value == 'status'){
  this.sortParams = 'isApproved'
  this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+"?sort=isApproved,"+this.sort+'&page='+pageNumber).subscribe((response:any)=>{
    this.approvalData = response.data.content;
  })
}
}

searchCustomer(event){
  let name = event.target.value;
 this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+"?fullName.contains="+name).subscribe((response:any)=>{
   this.approvalData = response.data.content;
})
}

addClass(event){
  let elementId = document.getElementById(event.target.id);
  if(event.target.className == "arrow-down"){
    elementId.classList.replace("arrow-down","arrow-up");
  }else{
    elementId.classList.replace("arrow-up","arrow-down");
  }
}

addRemark(form:NgForm){
   this.customerDto 
   var customerRemark = new CustomerRemark();
   customerRemark.customerId = this.customerId;
   customerRemark.remarks = form.form.value.remarks; 
   this.service.post_service(ApiServiceServiceService.apiList.customerRemark,customerRemark).subscribe((response)=>{
    this.toastr.success('','Added remarks/comments successfully.', {
      timeOut : 2000
    }) 

    $('#customer').modal('hide');
    this.getCustomerForApproval();
     
   })
   form.resetForm()
}
}


