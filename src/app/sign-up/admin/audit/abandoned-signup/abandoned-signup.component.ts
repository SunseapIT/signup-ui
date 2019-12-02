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
  q:number=1;
  searchTextAbandoned : string;


  constructor(private service:ApiServiceServiceService) {

    for (let i = 1; i <= 100; i++) {
      this.abandonedData.push(`item ${i}`);
    }
  }



  ngOnInit() {
    this.getAbandonedUsers();
  }

  getAbandonedSignUp(){
    let filterData = [];
    this.tempData.forEach(element => {
      
      if(new Date(element.sighnUpStarTimeStamp) > this.dateTimeRange[0] && new Date(element.sighnUpEndTimeStamp) < this.dateTimeRange[1]){
        filterData.push(element);
      }
    });
    this.abandonedData = filterData;
  }

  

  getAbandonedUsers(){
    this.service.get_service(ApiServiceServiceService.apiList.getTimestampUrl).subscribe((response)=>{
      var responseData = response;
      var resultObject = responseData['data'];
      var resultObject1 = resultObject['content'];
      this.abandonedData = resultObject1;   
      
      console.log('Abandoned', this.abandonedData);
      

    })
  }
  
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    // headers: ['Name', 'Email Address', 'Initialstamp', 'Finalstamp'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true,
    // keys: ['fullName', 'eamilAddress','sighnUpStarTimeStamp', 'sighnUpEndTimeStamp']
  };
}
