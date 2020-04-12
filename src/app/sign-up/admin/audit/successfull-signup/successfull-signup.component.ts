import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from './../../../../api-service-service.service';
import { Component, OnInit,  } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import {
  ConfigService,
  DWELLING_TYPE_OPTIONS,
  ETC_FEE_OPTIONS,} from '@app/core';

@Component({
  selector: 'app-successfull-signup',
  templateUrl: './successfull-signup.component.html',
  styleUrls: ['./successfull-signup.component.scss']
})
export class SuccessfullSignupComponent implements OnInit {
  ETC_FEE_OPTIONS = ETC_FEE_OPTIONS;
  public dateTimeRange: Date[];

  sort = "asc"
  sortParam = 'fullName'
  sortingValue = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
  successData = [];
  p: number = 1;
  searchTextSuccess: string;
  totalItems: any;
  page: number = 1;
  searchedData;
  hour12Timer: boolean = false;
  searched: any = [];
  currentPage: number = 1;
  isLoader: boolean = false;
  searchText: any;
  csvDataSuccess = []
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['First Name',
      'Last Name',
      'Email Address',
      'Plan Name',
      'SP Account Number',
      'Promo Code',
      'Address',
      'Initialstamp',
      'Finalstamp'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: ['fullName',
      'lastName',
      'eamilAddress',
      'plan',
      'spAccountNumber',
      'promoCode',
      'buildingName',
      'sighnUpStarTimeStamp',
      'sighnUpEndTimeStamp']
  };
  max = new Date();
  queryParams = "";
  filters = {
    fromTimestamp: "",
    toTimestamp: "",
    size: 10,
    page: 0,
  }

  constructor(private service: ApiServiceServiceService,
    private dateFormat: DatePipe) {
  }

  ngOnInit() {
    this.getAllSuccessSignupUsers(null);
  }

  getAllSuccessSignupUsers(val) {
    this.isLoader = true;
    this.buildQueryParams();
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "/?" + this.queryParams + "&sort=" + this.sortParam + ',' + this.sort)
      .subscribe((response: any) => {
        this.isLoader = false;
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvFormatSuccessSignup(val);
      })
  }


  searchCustomer(event) {
    // let name = event.target.value;
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?fullName.contains=" + this.searchText + "&page=" + (this.page - 1)).subscribe((response: any) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      this.totalItems = responseData.totalElements;
      var responseContent = responseData['content'];
      this.successData = responseContent;
      this.searched = this.successData
      this.csvDataSuccess = this.successData;

    })
  }

  clearValue() {
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getAllSuccessSignupUsers(null);
  }
  getFilteredList() {
    this.filters['fromTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = this.page ? this.page - 1 : 0;
    this.getAllSuccessSignupUsers(null);
  }
  getSuccessfulSignUp() {
    this.filters['fromTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = 0;
    this.getAllSuccessSignupUsers("datetime");
  }
  buildQueryParams() {
    let finalQuery = '';
    for (const item in this.filters) {
      if (this.filters[item]) {
        finalQuery = finalQuery + '&' + item + '=' + this.filters[item];
      }
    }
    this.queryParams = finalQuery.replace('&', '');
  }
  getTimeStamp(time) {
    return this.dateFormat.transform(time, "dd-MM-yyyy hh:mm:ss");
  }
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    if (this.searchText != undefined && this.searchText != "") {
      this.searchCustomer(this.searchText);
    }
    else {
      this.getFilteredList();
      this.searched;
    }
  }

  resetFilters() {
    this.filters = {
      fromTimestamp: "",
      toTimestamp: "",
      size: 10,
      page: 0,
    }
  }

  csvFormatSuccessSignup(value) {
    if (value == 'datetime') {
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?size=" + this.totalItems + '&fromTimestamp=' + this.getTimeStamp(this.dateTimeRange[0])
        + '&toTimestamp=' + this.getTimeStamp(this.dateTimeRange[1])).subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.csvDataSuccess = responseContent;
        })
    } else {
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?size=" + this.totalItems).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.csvDataSuccess = responseContent;
      })
    }
  }

  sorting(value, format) {
    let pageNumber = 0
    if (this.page == 0) {
      pageNumber = 0
    } else {
      pageNumber = this.page - 1;
    }

    if (format) {
      this.sort = "asc"
    } else {
      this.sort = "desc"
    }
    if (value == 'spAccount') {
      this.sortParam = "spAccountNumberDetails.spAccountNumber";
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=spAccountNumberDetails.spAccountNumber,"
        + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.successData = responseContent;
          this.csvDataSuccess = this.successData;
        })
    }
    else if (value == 'planName') {
      this.sortParam = 'plans.planName';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=plans.planName," + this.sort + '&page=' + pageNumber)
        .subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.successData = responseContent;
          this.csvDataSuccess = this.successData;
        })
    }
    else if (value == 'email') {
      this.sortParam = 'eamilAddress';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=eamilAddress," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;

      })
    }
    else if (value == 'promoCode') {
      this.sortParam = 'customerPromoCodes.customerPromoCode';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=customerPromoCodes.customerPromoCode," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;

      })
    }

    else if (value == 'address') {
      this.sortParam = 'addressData.buildingName'
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=addressData.buildingName," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;

      })
    }
    else if (value == 'lastName') {
      this.sortParam = 'lastName';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=lastName," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData
      })
    }
    else if (value == 'firstName') {
      this.sortParam = 'fullName';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=fullName," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;

      })
    }
    else if (value == 'initial') {
      this.sortParam = 'TimestampRecords.planDetails'
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=TimestampRecords.planDetails," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;
      })
    }
    else if (value == 'final') {
      this.sortParam = 'TimestampRecords.signUp';
      this.service.get_service(ApiServiceServiceService.apiList.searchCustomersUrl + "?sort=TimestampRecords.signUp," + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData['content'];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;
      })
    }
  }

  addClass(event) {
    let elementId = document.getElementById(event.target.id);
    if (event.target.className == "arrow-down") {
      elementId.classList.replace("arrow-down", "arrow-up");
    } else {
      elementId.classList.replace("arrow-up", "arrow-down");
    }

  }
}
