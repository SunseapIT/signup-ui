import { LocalDataSource } from 'ng2-smart-table';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  public dateTimeRange: Date[];
  data =[] ;
  tempData =[] ;
  p:number=1;
  searchTextSuccess : string;
  searchTextAbandoned : string;


  constructor(private service:ApiServiceServiceService) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getTableData(){
    let filterData = [];
    this.tempData.forEach(element => {
      
      if(new Date(element.sighnUpStarTimeStamp) > this.dateTimeRange[0] && new Date(element.sighnUpEndTimeStamp) < this.dateTimeRange[1]){
        filterData.push(element);
      }
    });
    this.data = filterData;
  }
  getAllUsers(){
   this.service.get_service(ApiServiceServiceService.apiList.getAllusersUrl).subscribe((response)=>{
    var responseData  = response;
    var resultObject = responseData['data'];
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

 
}
