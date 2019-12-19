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

  public dateTimeRange: Date[];

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

  spFlag:boolean;
  isPlanFlag:boolean;
  isPostalFlag:boolean;
  isDwellingFlag:boolean;
  isPromoCodeFlag:boolean;

  config = { validationRegex: null };
  newServiceAddress = { houseNo: '', level: '', unitNo: '', levelUnit: '', streetName: '', buildingName: '' };



  customerDto = new CustomerDto();
  selectedPricingPlan:string;
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

  postalCode:any;

  warningMessage = '';
   size = 10;
   page:number = 1;
  customerId: any;

  constructor(private service:ApiServiceServiceService,
    public parent: OrderComponent,
    public modal: ModalService,
    private dateFormat:DatePipe,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private router: Router,
    private gtagService: GoogleTagManagerService,
    private toster : ToastrService) {
  }

  ngOnInit() {
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
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersForApprovalUrl+"?size="+this.size+'&page='+(this.page-1)).subscribe((responseData:any)=>{
     this.isLoader=false;
      var resultObject = responseData['data'];
      this.totalItems = resultObject.totalElements;
      var resultObject1 = resultObject['content'];
      this.approvalData = resultObject1;     
      console.log(' this.approvalData', this.approvalData);
         
    })
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
console.log('customerList customerList',customerList);
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

   $('#customer').modal('show');
 }



 arrowChange(){
  this.arrow=!this.arrow
}

getPlans(){
  this.service.get_service(ApiServiceServiceService.apiList.customerViewPlanUrl).subscribe((response)=>{
    var responseData  = response;
    var resultObject = responseData['data'];
    this.planList = resultObject;   
  })
}

addPromoCode(){
  this.promoCode.push({referralCode :''})   
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
      console.log('response file',response);      
    var data = "data:application/pdf;base64," +response['data']
    this.pdfSrc = data; 
  })
   $("#myModal").modal("show")
}

onSubmit(form:NgForm){
   // this.isLoader=true;  
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
  this.service.post_service(ApiServiceServiceService.apiList.approveCustomerUrl, customerDto).subscribe((response)=>{
   
})
}
}


