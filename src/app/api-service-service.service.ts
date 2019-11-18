import { environment } from '@env/base';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceServiceService {


  public static apiList = {
    
    adminLogin:environment.baseUrl+"/api/v1/user/login",
    addPlanUrl:environment.baseUrl+"/api/v1/admin/addPlan",
    viewPlanUrl: environment.baseUrl+"/api/v1/admin/getPlans",
    customerViewPlanUrl:environment.baseUrl+"/api/v1/customer/getPlans",
    removePlansUrl:environment.baseUrl+"/api/v1/admin/removePlan",
    updateTimeUrl:environment.baseUrl+"/api/v1/customer/updateTime",
    addAddressUrl:environment.baseUrl+"/api/v1/customer/addAddress",
    saveCustomerurl:environment.baseUrl+"/api/v1/customer/saveCustomer",
    getAllusersUrl:environment.baseUrl+"/api/v1/admin/getAllUsers" ,
    getFactSheet:environment.baseUrl+"/api/v1/customer/getFactSheet",   

  }

  constructor(private http:HttpClient) { }

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

  
}
