import { DatePipe } from "@angular/common";
import { ApiServiceServiceService } from "./../../../../api-service-service.service";
import { Component, OnInit } from "@angular/core";
import { PageChangedEvent } from "ngx-bootstrap";
import {
  ConfigService,
  DWELLING_TYPE_OPTIONS,
  ETC_FEE_OPTIONS,
} from "@app/core";

@Component({
  selector: "app-successfull-signup",
  templateUrl: "./successfull-signup.component.html",
  styleUrls: ["./successfull-signup.component.scss"],
})
export class SuccessfullSignupComponent implements OnInit {
  ETC_FEE_OPTIONS = ETC_FEE_OPTIONS;
  public dateTimeRange: Date[];

  columns = ["First Name", "Last Name", "Email", "Mobile", "SP Number", "Building Name"];

   dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  sort = "asc";
  sortParam = "fullName";
  sortingValue = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
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
  csvDataSuccess = [];
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    showLabels: false,
    headers: [
      "First Name",
      "Last Name",
      "Email Address",
      "Mobile Number",
      "SP Account Number",
      "Promo Code",
      "Building Name",
      "House No",
      "Level",
      "Unit",
      "Street Name",
      "Postal Code",
      "Dwelling Type",
      "Plan Name",
      "Signup Date",
      "Approval Date",
      "Contract Price",
      "Account Holder",
      "Market",
    ],
    showTitle: true,
    title: "",
    useBom: true,
    removeNewLines: true,
    keys: [
      "fullName",
      "lastName",
      "eamilAddress",
      "mobileNumber",
      "spAccountNumber",
      "promoCode",
      "buildingName",
      "houseNo",
      "level",
      "unitNo",
      "streetName",
      "postelCode",
      "dwelingType",
      "plan",
      "sighnUpStarTimeStamp",
      "approvedTime",
      "rate",
      "isSelfSignupDes",
      "isContentToMarketingDes",
    ],
  };
  max = new Date();
  queryParams = "";
  filters = {
    fromTimestamp: "",
    toTimestamp: "",
    size: 10,
    page: 0,
  };

  constructor(
    private service: ApiServiceServiceService,
    private dateFormat: DatePipe
  ) {}

  ngOnInit() {
    this.getAllSuccessSignupUsers(null);
    this.onSelectColumn();
  }

  getAllSuccessSignupUsers(val) {
    this.isLoader = true;
    this.buildQueryParams();
    this.service
      .get_service(
        ApiServiceServiceService.apiList.searchCustomersUrl +
          "/?" +
          this.queryParams +
          "&sort=" +
          this.sortParam +
          "," +
          this.sort
      )
      .subscribe((response: any) => {
        this.isLoader = false;
        var responseBody = response["body"];
        var responseData = responseBody["data"];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData["content"];
        this.successData = responseContent;
        this.csvFormatSuccessSignup(val);
      });
  }

  searchCustomer(event) {
    if(this.searchText!=null && this.searchText.trim()!=''){
    this.service
      .get_service(
        ApiServiceServiceService.apiList.searchCustomersUrl +
          "?searchKey=" +
          this.searchText +
          "&page=" +
          (this.page - 1)
      )
      .subscribe((response: any) => {
        var responseBody = response["body"];
        var responseData = responseBody["data"];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData["content"];
        this.successData = responseContent;
        this.searched = this.successData;
        this.csvDataSuccess = this.successData;
      });}else{
        this.getFilteredList();
      }
  }

  clearValue() {
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getAllSuccessSignupUsers(null);
  }
  getFilteredList() {
    this.filters["fromTimestamp"] = this.dateTimeRange
      ? this.getTimeStamp(this.dateTimeRange[0])
      : null;
    this.filters["toTimestamp"] = this.dateTimeRange
      ? this.getTimeStamp(this.dateTimeRange[1])
      : null;
    this.filters["page"] = this.page ? this.page - 1 : 0;
    this.getAllSuccessSignupUsers(null);
  }
  getSuccessfulSignUp() {
    this.filters["fromTimestamp"] = this.dateTimeRange
      ? this.getTimeStamp(this.dateTimeRange[0])
      : null;
    this.filters["toTimestamp"] = this.dateTimeRange
      ? this.getTimeStamp(this.dateTimeRange[1])
      : null;
    this.filters["page"] = 0;
    this.getAllSuccessSignupUsers("datetime");
  }
  buildQueryParams() {
    let finalQuery = "";
    for (const item in this.filters) {
      if (this.filters[item]) {
        finalQuery = finalQuery + "&" + item + "=" + this.filters[item];
      }
    }
    this.queryParams = finalQuery.replace("&", "");
  }
  getTimeStamp(time) {
    return this.dateFormat.transform(time, "dd-MM-yyyy hh:mm:ss");
  }
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    if (this.searchText != undefined && this.searchText != "") {
      this.searchCustomer(this.searchText);
    } else {
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
    };
  }

  csvFormatSuccessSignup(value) {
    if (value == "datetime") {
      this.service
        .get_service(
          ApiServiceServiceService.apiList.searchCustomersUrl +
            "?size=" +
            this.totalItems +
            "&fromTimestamp=" +
            this.getTimeStamp(this.dateTimeRange[0]) +
            "&toTimestamp=" +
            this.getTimeStamp(this.dateTimeRange[1])
        )
        .subscribe((response: any) => {
          var responseBody = response["body"];
          var responseData = responseBody["data"];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData["content"];
          this.csvDataSuccess = responseContent;
        });
    } else {
      this.service
        .get_service(
          ApiServiceServiceService.apiList.searchCustomersUrl +
            "?size=" +
            this.totalItems
        )
        .subscribe((response: any) => {
          var responseBody = response["body"];
          var responseData = responseBody["data"];
          this.totalItems = responseData.totalElements;
          var responseContent = responseData["content"];
          this.csvDataSuccess = responseContent;
        });
    }
  }

  sorting(value, format) {
    let pageNumber = 0;
    if (this.page == 0) {
      pageNumber = 0;
    } else {
      pageNumber = this.page - 1;
    }

    if (format) {
      this.sort = "asc";
    } else {
      this.sort = "desc";
    }

    if (value == "spAccount") {
      this.sortParam = "spAccountNumberDetails.spAccountNumber";
    } else if (value == "planName") {
      this.sortParam = "plans.planName";
    } else if (value == "email") {
      this.sortParam = "eamilAddress";
    } else if (value == "promoCode") {
      this.sortParam = "customerPromoCodes.customerPromoCode";
    } else if (value == "building") {
      this.sortParam = "addressData.buildingName";
    } else if (value == "lastName") {
      this.sortParam = "lastName";
    } else if (value == "firstName") {
      this.sortParam = "fullName";
    } else if (value == "initial") {
      this.sortParam = "TimestampRecords.planDetails";
    } else if (value == "final") {
      this.sortParam = "TimestampRecords.signUp";
    } else if (value == "mobile") {
      this.sortParam = "mobileNumber";
    } else if (value == "level") {
      this.sortParam = "level";
    } else if (value == "unit") {
      this.sortParam = "unitNo";
    } else if (value == "dwelling") {
      this.sortParam = "addressData.dwellingType";
    } else if (value == "street") {
      this.sortParam = "addressData.streetName";
    } else if (value == "contractTerm") {
      this.sortParam = "plans.planInMonths";
    } else if (value == "rate") {
      this.sortParam = "plans.rate";
    } else if (value == "selfSignup") {
      this.sortParam = "selfSignup";
    } else if (value == "contentToMarketing") {
      this.sortParam = "contentToMarketing";
    } else if (value == "planType") {
      this.sortParam = "plans.planType";
    } else if (value == "approvalTime") {
      this.sortParam = "approvedTime";
    } else if (value == "postal") {
      this.sortParam = "addressData.postalCode";
    } else if (value == "houseNo") {
      this.sortParam = "addressData.houseNo";
    } else if (value == "etc") {
      this.sortParam = "addressData.etc.etcRate";
    }
    
    this.service
      .get_service(
        ApiServiceServiceService.apiList.searchCustomersUrl +
          "?sort=" +
          this.sortParam +","+
          this.sort +
          (this.searchText?"&searchKey="+this.searchText : "")+
          "&page=" +
          pageNumber
      )
      .subscribe((response: any) => {
        var responseBody = response["body"];
        var responseData = responseBody["data"];
        this.totalItems = responseData.totalElements;
        var responseContent = responseData["content"];
        this.successData = responseContent;
        this.csvDataSuccess = this.successData;
      });
  }

  addClass(event) {
    let elementId = document.getElementById(event.target.id);
    if (event.target.className == "arrow-down") {
      elementId.classList.replace("arrow-down", "arrow-up");
    } else {
      elementId.classList.replace("arrow-up", "arrow-down");
    }
  }

  onSelectColumn(){
    this.dropdownList = [
      { item_id: 1, item_text: 'First Name' },
      { item_id: 2, item_text: 'Last Name' },
      { item_id: 3, item_text: 'Email' },
      { item_id: 4, item_text: 'Mobile' },
      { item_id: 5, item_text: 'SP Number' },
      { item_id: 6, item_text: 'House No' }
    ];
    this.selectedItems = [];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
