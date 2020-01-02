import { Plandto } from './sign-up/admin/dto/plan-dto';
import { environment } from '@env/base';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceServiceService {


  public static apiList = {

    //ADMIN 
    approveCustomerUrl : environment.baseUrl+"/api/v1/admin/approveCustomer",
    addPlanUrl:environment.baseUrl+"/api/v1/admin/addPlan",
    viewPlanUrl: environment.baseUrl+"/api/v1/admin/getPlans",
    getAllusersUrl:environment.baseUrl+"/api/v1/admin/getAllUsers",
    searchTimestampsByDateRangeUrl : environment.baseUrl+"/api/v1/admin/searchTimestampsByDateRange",
    searchCustomersByDateRangeUrl : environment.baseUrl+"/api/v1/admin/searchCustomersByDateRange",
    searchCustomersForApprovalUrl : environment.baseUrl+"/api/v1/admin/searchCustomersForApproval",
    removePlansUrl:environment.baseUrl+"/api/v1/admin/removePlan",
    encodeFileUrl : environment.baseUrl+"/api/v1/admin/encodedFile",
    messageUrl : environment.baseUrl+"/api/v1/admin/addNote",
    searchCustomersUrl : environment.baseUrl+"/api/v1/admin/searchCustomers",
    addPromoCodeUrl : environment.baseUrl+"/api/v1/admin/addPromocode",
    getPromoCodeUrl : environment.baseUrl+"/api/v1/admin/getPromocode",
    getPromoCodeById : environment.baseUrl+"/api/v1/admin/getPromocodeById",
    deletePromoCodeUrl : environment.baseUrl+"/api/v1/admin/deletePromoCode",
   

    //CUSTOMER    
    addAddressUrl:environment.baseUrl+"/api/v1/customer/addAddress",
    saveCustomerurl:environment.baseUrl+"/api/v1/customer/saveCustomer",
    verifyPromoUrl:environment.baseUrl+"/api/v1/customer/verifyPromoCode",
    verifyMobileUrl:environment.baseUrl+"/api/v1/customer/verifyMobile",
    sendEmailOtp:environment.baseUrl+"/api/v1/customer/send-email-otp",
    customerViewPlanUrl:environment.baseUrl+"/api/v1/customer/getPlans",  
    getFactSheet:environment.baseUrl+"/api/v1/customer/getFactSheet",
    getTimestampUrl: environment.baseUrl+"/api/v1/customer/timestamps",   
    getCustomerFactsheetUrl : environment.baseUrl+"/api/v1/customer/getUpdatedFactSheet",
    getEmailOtp: environment.baseUrl+"/api/v1/customer/validate-email-otp",
    dateTimeRangePicker : environment.baseUrl+"/api/v1/customer/search",    
    sendMobileOtp:environment.baseUrl+"/api/v1/customer/generateOtp",   
    getMessageUrl : environment.baseUrl+"/api/v1/customer/getNote",

    
    //LOGIN
    adminLogin:environment.baseUrl+"/api/v1/user/login",

   
    //TIMESTAMP API
    updateTimeUrl:environment.baseUrl+"/api/v1/customer/updateTime",
    addCardDetailUrl:environment.baseUrl+"/api/v1/tokens/tokenize",
  }

  constructor(private http:HttpClient, private router : Router) { }

  getPromoCodeById(id:number){
    return this.http.get(this.getPromoCodeById + '/'+id);
  }
  

   //Get service
get_service(url) {
  var localStorageVariable = '';
  if (localStorage.getItem('Authorization')) {
  localStorageVariable = localStorage.getItem('Authorization');
  }
  let headerJson = {
  'Content-Type': 'application/json',
  'Authorization': localStorageVariable
};
  const httpOptions = {
  headers: new HttpHeaders(headerJson)
  };

  return this.http.get(url, httpOptions).pipe(map((response) => {
  return response;
  }));
  
  }

  getFactSheetGet_service(url) {
    var localStorageVariable = '';
    if (localStorage.getItem('Authorization')) {
    localStorageVariable = localStorage.getItem('Authorization');
    }
    let headerJson = {
    'Content-Type': 'application/json',
    // 'Authorization': localStorageVariable
  };
    const httpOptions = {
    headers: new HttpHeaders(headerJson)
    };
  
    return this.http.get(url, httpOptions).pipe(map((response) => {
    return response;
    }));
    
    }

  post_service(url, data) {
    var localStorageVariable = '';
    if (localStorage.getItem('Authorization')) {
    localStorageVariable = localStorage.getItem('Authorization');
    }
    let headerJson = {
    'Content-Type': 'application/json',
    'Authorization': localStorageVariable

    };
    const httpOptions = {
    headers: new HttpHeaders(headerJson)
    };
    return this.http.post(url, data, httpOptions).pipe(map((response) => {
    return response;
    }));
  }


  multiPartPost_service(url, data) {
    var localStorageVariable = '';
    if (localStorage.getItem('Authorization')) {
    localStorageVariable = localStorage.getItem('Authorization');
    }
    let headerJson = {

    // 'Content-Type': 'application/json',
    // 'Content-Type': 'multipart/form-data',
    'Authorization': localStorageVariable

    };
    const httpOptions = {
    headers: new HttpHeaders(headerJson)
    };
    return this.http.post(url, data, httpOptions).pipe(map((response) => {
    return response;
    }));
  }


  get_authentiaction(url) {
    var localStorageVariable = '';
    if (localStorage.getItem('Authorization')) {
    localStorageVariable = localStorage.getItem('Authorization');
    }
    let headerJson = {
    'Content-Type': 'application/json',
    'Authorization': localStorageVariable

   };
    const httpOptions = {
    headers: new HttpHeaders(headerJson)
    };
    
    return this.http.get(ApiServiceServiceService.apiList['loginAdmin']+url, httpOptions).pipe(map((response) => {
    return response;
    }));
    
    }


   get_Token() {
  return localStorage.getItem('Authorization');
  }
  login(): boolean {
  if (this.get_Token() != null) {
  return true;
  }
  else {
  this.router.navigate(['/']);
  return false;
  }
  }    

  
}
