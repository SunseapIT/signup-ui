import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from './../../../../api-service-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-successfull-signup',
  templateUrl: './successfull-signup.component.html',
  styleUrls: ['./successfull-signup.component.scss']
})
export class SuccessfullSignupComponent implements OnInit {
  public dateTimeRange: Date[];
  data =[] ;

  successData =[];
  p:number=1;
  searchTextSuccess : string;
  totalItems:any;
  page:number;
  currentPage=1;
  isLoader:boolean=false;

  csvDataSuccess=[]
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Name', 'Email Address', 'Initialstamp', 'Finalstamp'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: ['fullName', 'eamilAddress','sighnUpStarTimeStamp', 'sighnUpEndTimeStamp']
  };
  max = new Date();
  queryParams = "";
  filters = {
    fromTimestamp:"",
    toTimestamp:"",
    size:10,
    page:0,
  }

  constructor(private service:ApiServiceServiceService,
    private dateFormat:DatePipe) {
  }

  ngOnInit() {
    this.getAllSuccessSignupUsers(null);
  }

  getAllSuccessSignupUsers(val){
    this.isLoader=true;
    this.buildQueryParams();
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersByDateRangeUrl+"/?"+this.queryParams).subscribe((responseData:any)=>{
     this.isLoader=false;
      var resultObject = responseData['data'];
      this.totalItems = resultObject.totalElements;
      var resultObject1 = resultObject['content'];
      this.currentPage = resultObject.number+1;
      this.successData = resultObject1;        
      this.csvFormatSuccessSignup(val);
    })
 }

  clearValue(){
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getAllSuccessSignupUsers(null);
  }
  getFilteredList(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page']= this.page ? this.page-1 : 0;
    this.getAllSuccessSignupUsers(null);  
  }
  getSuccessfulSignUp(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
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
  getTimeStamp(time){
    return this.dateFormat.transform(time,"dd-MM-yyyy hh:mm:ss");
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.getFilteredList();
  }

  resetFilters(){
    this.filters = {
      fromTimestamp:"",
      toTimestamp:"",
      size:10,
      page: 0,
    }
  }

 csvFormatSuccessSignup(value){  
   if(value == 'datetime'){
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersByDateRangeUrl+"?size="+this.totalItems+'&fromTimestamp='+this.getTimeStamp(this.dateTimeRange[0])+'&toTimestamp='+this.getTimeStamp(this.dateTimeRange[1])).subscribe((response:any)=>
      {
        var requestObj = response.data.content;
        this.csvDataSuccess= requestObj;     
      }) 
   }else{
    this.service.get_service(ApiServiceServiceService.apiList.searchCustomersByDateRangeUrl+"?size="+this.totalItems).subscribe((response:any)=>
      {
        var requestObj = response.data.content;
        this.csvDataSuccess= requestObj;     
      }) 
   }
   
 }
 

}
