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
  tempData =[] ;
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
    this.getAllSignupUsers();
    this.csvFormat();
  }
  getAllSignupUsers(){
    this.buildQueryParams();
    console.log(this.queryParams);
    this.service.get_service(ApiServiceServiceService.apiList.searchTimestampsByDateRangeUrl+"/?"+this.queryParams).subscribe((responseData:any)=>{
       var resultObject = responseData['data'];
       this.totalItems = resultObject.totalElements;
       var resultObject1 = resultObject['content'];
       this.currentPage = resultObject.number+1;
       this.abandonedData = resultObject1;   
    })
    console.log(this.currentPage);
    
  }
  clearValue(){
    this.page = 0;
    this.dateTimeRange = [];
    this.resetFilters();
    this.getAllSignupUsers();
  }
  getFilteredList(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page']= this.page ? this.page-1 : 0;
    this.getAllSignupUsers();  
  }
  getAbandonedSignUp(){
    this.filters['fromTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[0]) : null;
    this.filters['toTimestamp'] =this.dateTimeRange ? this.getTimeStamp(this.dateTimeRange[1]) : null;
    this.filters['page'] = 0;
    this.getAllSignupUsers();  
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

  csvData=[];
  csvFormat(){
    this.service.get_service(ApiServiceServiceService.apiList.searchTimestampsByDateRangeUrl).subscribe((response:any)=>
    {
      var responseObj = response;
      console.log('response',response.data.content);
      
      for(let i=0; i<responseObj ;i++){
        this.csvData.push(responseObj)
        console.log('for this.csvData',this.csvData);
        
      }
      console.log('this.csvData',this.csvData);
      
      
    })
  }


}
