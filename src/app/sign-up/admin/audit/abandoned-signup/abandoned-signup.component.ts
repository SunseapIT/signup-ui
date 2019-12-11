import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';

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
  currentPage=3;
  isLoader:boolean=false;
  constructor(private service:ApiServiceServiceService) {

    // for (let i = 1; i <= 100; i++) {
    //   this.abandonedData.push(`item ${i}`);
    // }
  }



  ngOnInit() {
    this.getAbandonedUsers(0);
  }

  getAbandonedSignUp(){
    let filterData = [];
    this.tempData.forEach(element => {
      
      if((new Date(element.plan_Details) > this.dateTimeRange[0] && new Date(element.plan_Details) < this.dateTimeRange[1]) ||
      (new Date(element.personal_Details) > this.dateTimeRange[0] && new Date(element.personal_Details) < this.dateTimeRange[1]) ||
      (new Date(element.address_Details) > this.dateTimeRange[0] && new Date(element.address_Details) < this.dateTimeRange[1]) ||
      (new Date(element.upload_Documents) > this.dateTimeRange[0] && new Date(element.upload_Documents) < this.dateTimeRange[1]) ||
      (new Date(element.review_order) > this.dateTimeRange[0] && new Date(element.review_order) < this.dateTimeRange[1])
      ){
        filterData.push(element);
      }
    });
    this.abandonedData = filterData;
    console.log('this.abandonedData=========>',this.abandonedData);
    
  }

  

  getAbandonedUsers(page){
    // this.isLoader=true;
    this.service.get_service(ApiServiceServiceService.apiList.getTimestampUrl+"?page="+page).subscribe((response)=>{
      // this.isLoader=false;
      var responseData = response;
      var resultObject = responseData['data'];
      this.totalItems = resultObject.totalElements;
      var resultObject1 = resultObject['content'];
      this.abandonedData = resultObject1;   
      this.tempData= JSON.parse(JSON.stringify(this.abandonedData));

    })
  }
  pageChanged(event: any): void {
    this.page = event.page-1;
    this.getAbandonedUsers(this.page);
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
    // keys: ['fullName', 'eamilAddress','sighnUpStarTimeStamp', 'sighnUpEndTimeStamp']
  };
}
