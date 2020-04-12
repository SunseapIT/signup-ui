import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-view-promocode',
  templateUrl: './view-promocode.component.html',
  styleUrls: ['./view-promocode.component.scss']
})
export class ViewPromocodeComponent implements OnInit {
  sort = "asc"
  sortParam = 'promoCode'
  sortingValue = [true,true,true,true,true]
  promoCodeData = [];
  public dateTimeRange: Date[];
  isLoader: boolean;
  searched: any = [];
  name: string = '';
  searchText: any;
  promoCode: string;
  dateFrom: string;
  dateTo: string;
  noOfLimitedUsers: any;
  isInfinity: boolean = true;
  page: number = 0;
  currentPage: number = 1;
  totalItems: any;

  queryParams = "";
  filters = {
    fromTimestamp: "",
    toTimestamp: "",
    size: 10,
    page: 0,
  }


  constructor(private service: ApiServiceServiceService,
    private toastr: ToastrService,
    private router: Router,
    private dateFormat: DatePipe) { }


  ngOnInit() {
    this.getPromoCode(null);

  }

  getPromoCode(val) {
    this.isLoader = true;
    this.buildQueryParams();
    this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "/?" + this.queryParams + "&sort=" + this.sortParam + ',' + this.sort).subscribe((response: any) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      this.totalItems = responseData.totalElements;
      var responseContent = responseData['content'];
      let status = responseBody['statusCode'];
      if (status == 200) {
        this.promoCodeData = responseContent;
      
        this.isLoader = false;
      }
      else {
        this.isLoader = false;
      }
    })
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

  edit(id: number) {
    this.router.navigate(['admin-login/admin-dash/edit', id]);
  }

  searchPromoCode(event) {
    this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?promoCode.equals=" + this.searchText + "&page=" + (this.page - 1)).subscribe((response: any) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      var responseContent = responseData['content'];
      this.totalItems = responseData.totalElements;
      this.promoCodeData = responseContent;
      this.searched =this.promoCodeData;
    })
  }

  clearValue() {
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getPromoCode(null);
  }

  resetFilters() {
    this.filters = {
      fromTimestamp: "",
      toTimestamp: "",
      size: 10,
      page: 0,
    }
  }

  getPromoCodeByRange() {
    this.filters['fromTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = 0;
    this.getPromoCode("datetime");
  }

  getTimeStamp(time) {
    return this.dateFormat.transform(time, "dd-MM-yyyy hh:mm:ss");
  }

  getFilteredList() {
    this.filters['fromTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] = this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = this.page ? this.page - 1 : 0;
    this.getPromoCode(null);
  }
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    if (this.searchText != undefined && this.searchText != "") {
      this.searchPromoCode(this.searchText);
    }
    else {
      this.getFilteredList();
      this.searched;
    }
  }


  delete(id) {
    this.service.get_service(ApiServiceServiceService.apiList.deletePromoCodeUrl + "?promoId=" + id).subscribe((response) => {
      var responseData = response;
      var resultObject = responseData['data'];
      // var promoCode = new Promocode();
      // promoCode = resultObject;
      // var findIndex = this.promoCodeData.findIndex(promoCodeId => promoCodeId.id === promoCode.id);
      // this.promoCodeData.splice(findIndex, 1);
      this.toastr.success('', 'Promo Code has been successfully removed.', {
        timeOut: 2000
      });

      this.getPromoCode(0);
    })
  }

  // searchPromoCode(event) {
  //   this.name = event.target.value;
  //   this.getPromoCode(this.page);

  // }


  addClass(event) {
    let elementId = document.getElementById(event.target.id);
    if (event.target.className == "arrow-down") {
      elementId.classList.replace("arrow-down", "arrow-up");
    } else {
      elementId.classList.replace("arrow-up", "arrow-down");
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
    if (value == 'promo') {
      this.sortParam = "promoCode";
      this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?sort=promoCode,"
        + this.sort + '&page=' + pageNumber).subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.promoCodeData = responseContent;
          
        })
    }
    else if (value == 'from') {
      this.sortParam = 'fromDate';
      this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?sort=fromDate," + this.sort + '&page=' + pageNumber)
        .subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.promoCodeData = responseContent;
         
        })
    }
  
    else if (value == 'to') {
      this.sortParam = 'toDate';
      this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?sort=toDate," + this.sort + '&page=' + pageNumber)
        .subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.promoCodeData = responseContent;
         
        })
    }
    else if (value == 'user') {
      this.sortParam = 'noOfUsers';
      this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?sort=user," + this.sort + '&page=' + pageNumber)
        .subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.promoCodeData = responseContent;
         
        })
    }
    else if (value == 'noOfUser') {
      this.sortParam = 'noOfLimitedUsers';
      this.service.get_service(ApiServiceServiceService.apiList.getPromocodeByCriteria + "?sort=noOfLimitedUsers," + this.sort + '&page=' + pageNumber)
        .subscribe((response: any) => {
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData['content'];
          this.promoCodeData = responseContent;
         
        })
    }
  }
}
