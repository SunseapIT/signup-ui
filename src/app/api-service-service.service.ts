import { Plandto } from './sign-up/admin/dto/plan-dto';
import { environment } from '@env/base';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceServiceService {


  public static apiList = {

    //ADMIN
    approveCustomerUrl: environment.baseUrl + "/api/v1/admin/approveCustomer",
    addPlanUrl: environment.baseUrl + "/api/v1/admin/addPlan",
    viewPlanUrl: environment.baseUrl + "/api/v1/admin/getPlans",
    getAllusersUrl: environment.baseUrl + "/api/v1/admin/getAllUsers",
    searchTimestampsByDateRangeUrl: environment.baseUrl + "/api/v1/admin/searchTimestampsByDateRange",
    searchCustomersByDateRangeUrl: environment.baseUrl + "/api/v1/admin/searchCustomersByDateRange",
    searchCustomersForApprovalUrl: environment.baseUrl + "/api/v1/admin/searchCustomersForApproval",
    removePlansUrl: environment.baseUrl + "/api/v1/admin/removePlan",
    encodeFileUrl: environment.baseUrl + "/api/v1/admin/encodedFile",
    messageUrl: environment.baseUrl + "/api/v1/admin/addNote",
    searchCustomersUrl: environment.baseUrl + "/api/v1/admin/searchCustomers",
    addPromoCodeUrl: environment.baseUrl + "/api/v1/admin/addPromocode",
    getPromoCodeUrl: environment.baseUrl + "/api/v1/admin/getPromocode",
    getPromoCodeById: environment.baseUrl + "/api/v1/admin/getPromocodeById",
    deletePromoCodeUrl: environment.baseUrl + "/api/v1/admin/deletePromoCode",
    customerRemark: environment.baseUrl + "/api/v1/admin/remarksForUser",
    getPromoByName: environment.baseUrl + "/api/v1/admin/getPromoByName",


    //CUSTOMER
    addAddressUrl: environment.baseUrl + '/api/v1/customer/addAddress',
    saveCustomerurl: environment.baseUrl + "/api/v1/customer/saveCustomer",
    verifyPromoUrl: environment.baseUrl + "/api/v1/customer/verifyPromoCode",
    verifyMobileUrl: environment.baseUrl + "/api/v1/customer/verifyMobile",
    sendEmailOtp: environment.baseUrl + "/api/v1/customer/send-email-otp",
    customerViewPlanUrl: environment.baseUrl + "/api/v1/customer/getPlans",
    getFactSheet: environment.baseUrl + "/api/v1/customer/getFactSheet",
    getTimestampUrl: environment.baseUrl + "/api/v1/customer/timestamps",
    getCustomerFactsheetUrl: environment.baseUrl + "/api/v1/customer/getUpdatedFactSheet",
    getEmailOtp: environment.baseUrl + "/api/v1/customer/validate-email-otp",
    dateTimeRangePicker: environment.baseUrl + "/api/v1/customer/search",
    sendMobileOtp: environment.baseUrl + "/api/v1/customer/generateOtp",
    getMessageUrl: environment.baseUrl + "/api/v1/customer/getNote",
    getSpAccountUrl: environment.baseUrl + "/api/v1/customer/getSpAccount",
    getCustomerSpAccountUrl: environment.baseUrl + "/api/v1/customer/getCustomerSpAccount",
    getPostalCode: environment.baseUrl + "/api/v1/customer/getAddressWithPostalCode",
    generateMobileOtp : environment.baseUrl + "/api/v1/user/generate-mobile-Otp",
    userLogin : environment.baseUrl + "/api/v1/user/login",
    verifyEmailOtp : environment.baseUrl + "/api/v1/user/verify-email-otp",
    requestEmailOtp : environment.baseUrl + "/api/v1/user/request-email-otp",
    changePassword : environment.baseUrl + "/api/v1/user/change-password",
    getCustomerDetailsByEmail : environment.baseUrl + "/api/v1/customer/get-customer-details-by-email",

    // LOGIN
    adminLogin: environment.baseUrl + "/api/v1/user/login",

    // TIMESTAMP API
    updateTimeUrl: environment.baseUrl + "/api/v1/customer/updateTime",
    addCardDetailUrl: environment.baseUrl + "/api/v1/tokens/tokenize",
  }

  constructor(private http: HttpClient, private router: Router) { }

  getPromoCodeById(id: number): Observable<any> {
    return this.http.get<any>(this.getPromoCodeById + '/' + id);
  }

  // Get service
  get_service(url): Observable<any> {
    return this.http.get<any>(url, { observe: 'response' });
  }

  getFactSheetGet_service(url): Observable<any> {
    return this.http.get<any>(url, { observe: 'response' });
  }

  post_service(url, data): Observable<any> {
    return this.http.post<any>(url, data, { observe: 'response' });
  }

  get_Token() {
    return localStorage.getItem('Authorization');
  }
  login(): boolean {
    if (this.get_Token() != null) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }


}
