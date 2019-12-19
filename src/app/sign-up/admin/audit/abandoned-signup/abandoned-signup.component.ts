import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-abandoned-signup',
  templateUrl: './abandoned-signup.component.html',
  styleUrls: ['./abandoned-signup.component.scss']
})
export class AbandonedSignupComponent implements OnInit {

  public dateTimeRange: Date[];
  abandonedData=[];
  csvData=[];
  searchTextAbandoned : string;
  totalItems:any;
  page:number;
  currentPage:number = 1;
  isLoader:boolean=false;
  max = new Date();
  queryParams = "";
  filters = {
    fromTimestamp:"",
    toTimestamp:"",
    size:10,
    page:0,
    sort : "planDetails,desc"
  }
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Plan Detail', 'Personal Detail', 'Address', 'Upload Document', 'Review Order', 'Confirm Order'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: ['planDetails', 'personal_Details','address_Details', 'upload_Documents','review_order']
  };
  constructor(private service:ApiServiceServiceService,private dateFormat:DatePipe) {}

  ngOnInit() {
    this.getAllSignupUsers(null);
  }


  getAllSignupUsers(value){
    this.isLoader=true;
    this.buildQueryParams();
    this.service.get_service(ApiServiceServiceService.apiList.searchTimestampsByDateRangeUrl+"/?"+this.queryParams).
    subscribe((responseData:any)=>{
      this.isLoader=false; 
      var resultObject = responseData['data'];       
       this.totalItems = resultObject.totalElements; 
       var resultObject1 = resultObject['content'];
       this.abandonedData = resultObject1;   
       this.csvFormat(value);
    })  
  }

  clearValue(){
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getAllSignupUsers(null);
  }

  getFilteredList(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page']= this.page ? this.page-1 : 0;
    this.getAllSignupUsers(null);  
  }

  getAbandonedSignUp(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = 0;
    this.getAllSignupUsers("datetime");  
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
      sort : "planDetails,desc"
    }
  }


  csvFormat(value){   
    if(value == "datetime"){
      this.service.get_service(ApiServiceServiceService.apiList.searchTimestampsByDateRangeUrl+"?size="+
      this.totalItems+"&sort=planDetails,desc"+"&fromTimestamp="+this.getTimeStamp(this.dateTimeRange[0])+'&toTimestamp='
      +this.getTimeStamp(this.dateTimeRange[1])).subscribe((response:any)=>
         {
         var requestObj = response.data.content;
         this.csvData= requestObj;    
         
         })
  }else{
      this.service.get_service(ApiServiceServiceService.apiList.searchTimestampsByDateRangeUrl+"?size="+this.totalItems+
      "&sort=planDetails,desc").subscribe((response:any)=>
    {
     var requestObj = response.data.content;
     this.csvData= requestObj;    
      
    })
    }
  }


}
