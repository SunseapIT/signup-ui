import { AddressDto } from './../../../core/address-dto';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit, Host, ViewChild } from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ConfigService, DWELLING_TYPE_OPTIONS, ModalService, UtilService, GoogleTagManagerService } from '@app/core';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES, STORAGE_KEYS } from '../order.constant';
import { NgForm } from '@angular/forms';
import { CustomerDto } from '@app/core/customer-dto';
import { TimeStampDto } from '@app/sign-up/admin/dto/time-stamp-dto';

const POSTAL_CODE_WARNING = 'The postal code you have entered is currently not eligible for the Open Electricity Market. ' +
  'Please refer to <a href="https://www.openelectricitymarket.sg/index.html" target="_blank">EMA\'s site</a> for more information.';
const POSTAL_CODE_ERROR_MESSAGE = 'Thank you for your interest, but we are sorry that we are unable to proceed with your registration.' +
  '<br>' + 'Please register when your ' +
  '<a href="https://www.openelectricitymarket.sg/index.html" target="_blank">postal code becomes eligible for </a>' +
  ', and we look forward to go #GreenerTogether with you soon.';
const POSTAL_CODE_REDIRECT_DELAY = 5000;

@Component({
  selector: 'app-service-address',
  templateUrl: './service-address.component.html',
})
export class ServiceAddressComponent implements OnInit {

  @ViewChild('warningModal') warningModal: any;
  @ViewChild('pickUpModal') pickUpModal: any;

  DWELLING_TYPE_OPTIONS = DWELLING_TYPE_OPTIONS;
  // DWELLING_TYPE_EVENT_NAMES must be the same position with DWELLING_TYPE_OPTIONS
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

  config = { validationRegex: null };

  validLocations = {};
  pickedLocation: string = null;
  serviceAddress = { houseNo: '', level: '', unitNo: '', levelUnit: '', streetName: '', buildingName: '' };

  warningMessage = '';

  constructor(
    @Host() public parent: OrderComponent,
    private localStorage: LocalStorage,
    private gtagService: GoogleTagManagerService,
    public modal: ModalService,
    configService: ConfigService,
    private utilService: UtilService,
    private service:ApiServiceServiceService
  ) {
    this.config.validationRegex = configService.get('validationRegex');
  }

  postalCode:any;

  ngOnInit() {

  this.postalCode=""
    this.localStorage.getItem(STORAGE_KEYS.SERVICE_ADDRESS)
      .subscribe(serviceAddress => serviceAddress && (this.serviceAddress = serviceAddress));

    if (this.parent.model.premise.dwellingType) {
      this.onSelectDwellingType(this.parent.model.premise.dwellingType);
    }
  }

  prefillAddress() {
    const { building, blockNo, roadName } = this.validLocations[this.pickedLocation];
    this.serviceAddress.buildingName = _.upperCase(building) === 'NIL' ? null : building;
    this.serviceAddress.houseNo =  _.upperCase(blockNo) === 'NIL' ? null : blockNo;
    this.serviceAddress.streetName = _.upperCase(roadName) === 'NIL' ? null : roadName;
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
              this.serviceAddress.buildingName = null;
              this.serviceAddress.houseNo = null;
              this.serviceAddress.streetName = null;
              break;
            case 1:
              this.serviceAddress.buildingName = _.upperCase(rs.items[0].building) === 'NIL' ? null : rs.items[0].building;
              this.serviceAddress.houseNo = _.upperCase(rs.items[0].blockNo) === 'NIL' ? null : rs.items[0].blockNo;
              this.serviceAddress.streetName = _.upperCase(rs.items[0].roadName) === 'NIL' ? null : rs.items[0].roadName;
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
    // Postal codes with the 2 first degits between 01 and 33 and after 1 May 2018 will be allowed
    if (moment().isSameOrAfter('2019-05-01') && _.inRange(+code.substring(0, 2), 1, 84)) {
      return _.inRange(+code.substring(0, 2), 1, 84);
    }
    // Postal codes with the 2 first digits between 58 and 78 will be allowed
    return _.inRange(+code.substring(0, 2), 34, 84);
  }

  onSelectDwellingType(name: string) {
    const dwellingTypes = _.map(DWELLING_TYPE_OPTIONS, (value, key: any) => ({ key: (!isNaN(key)) ? Number(key) : key, value }));
    const index = _.findIndex(dwellingTypes, type => _.isEqual(type.key, name));
    if (index >= 0) {
      this.gtagService.sendEvent(this.DWELLING_TYPE_EVENT_NAMES[index]);
    }
  }

  onSubmit(form : NgForm) {
    const parent = this.parent;
    if (form.valid) {
      this.serviceAddress.levelUnit = (this.serviceAddress.level) ? `#${this.serviceAddress.level}-${this.serviceAddress.unitNo}` : '';
      parent.model.premise.serviceAddress = _.chain(this.serviceAddress)
        .pick([ 'houseNo', 'streetName', 'buildingName', 'levelUnit' ])
        .values()
        .without('')
        .join(' ')
        .value();
        var addressDto = new AddressDto();
        addressDto.buildingName = form.value.buildingName;
        addressDto.dwellingType = form.value.dwellingType;
        addressDto.houseNo = form.value.houseNo;
        addressDto.postalCode = form.value.servicePostalCode;
        addressDto.streetName = form.value.streetName;
        
     var customerDto = new CustomerDto();
      var objStr = localStorage.getItem("customerObj");
      customerDto = JSON.parse(objStr);
      customerDto.postelCode = form.value.servicePostalCode;
      customerDto.buildingName = form.value.buildingName;
      customerDto.dwelingType = form.value.dwellingType;
      customerDto.houseNo = form.value.houseNo;
      customerDto.streetName = form.value.streetName; 
      customerDto.unitNo = form.value.unitNo;
      customerDto.level = form.value.level;
      localStorage.setItem("customerObj",JSON.stringify(customerDto))
      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "ADDRESS_DETAILS",
      timeStampDto.token = localStorage.getItem("Token");
      this.service.post_service(ApiServiceServiceService.apiList.addAddressUrl,addressDto).subscribe((response)=>{
      var responseData  = response;
      var status = responseData['statusCode'];
      if(status == 200){
        this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{        
      
       })
        }
      })   
      parent.saveAndNext(); 
      form.resetForm(); 
    } 
  }
}
