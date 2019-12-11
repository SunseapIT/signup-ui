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

  tempData =[] ;
  p:number=1;
  searchTextSuccess : string;
  totalItems:any;
  page:number;
  currentPage=3;
  isLoader:boolean=false;

  constructor(private service:ApiServiceServiceService) {

    for (let i = 1; i <= 100; i++) {
      this.data.push(`item ${i}`);
    }
  }

  isDateTimeSelected:boolean=false;

  clearValue() {
    this.tempData=[];
    this.getAllUsers();
    //this.dateTimeRange.setValue([null, null]);
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getSuccessfulSignUp(){
    let filterData = [];
    this.tempData.forEach(element => {
      
      if(new Date(element.sighnUpStarTimeStamp) > this.dateTimeRange[0] && new Date(element.sighnUpEndTimeStamp) < this.dateTimeRange[1]){
        filterData.push(element);
      }
    });
    this.data = filterData;
  }

  
  getAllUsers(){
    // this.isLoader = true;
   this.service.get_service(ApiServiceServiceService.apiList.getAllusersUrl).subscribe((response)=>{
    //  this.isLoader=false;
    var responseData  = response;
    var resultObject = responseData['data'];
    console.log(resultObject);
    
    this.data = resultObject;
    this.tempData = JSON.parse(JSON.stringify(this.data));
   })
  }
  
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

  // pageChanged(event: any): void {
  //   this.page = event.page;
  // }

}
