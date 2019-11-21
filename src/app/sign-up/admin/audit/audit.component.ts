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
  source: LocalDataSource;

  p:number=1;
  searchText : string;


  constructor(private service:ApiServiceServiceService,
   ) {
    this.source = new LocalDataSource(this.data);
   }

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
    console.log('response------>', response);   

    var responseData  = response;
    var resultObject = responseData['data'];
    this.data = resultObject;
    this.tempData = JSON.parse(JSON.stringify(this.data));
    this.source = new LocalDataSource(this.data);
   })
  }



  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false
  },
    columns : {
      fullName : { 
      title : 'Name',
      filter: false
    },
    eamilAddress : { 
      title : 'Email',
      filter: false
    },
  
    sighnUpStarTimeStamp : {
    title : 'Initial Timestamp',
    filter: false
  },
    sighnUpEndTimeStamp : {
    title : 'Final Timestamp',
    filter: false
  },
 
  }
  }
  
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    title: 'Audit Log',
    useBom: false,
    removeNewLines: true,
    keys: ['fullName', 'eamilAddress','sighnUpStarTimeStamp', 'sighnUpEndTimeStamp']
  };

 
}
