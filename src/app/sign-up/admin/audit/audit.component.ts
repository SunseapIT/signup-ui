import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  data =[] ;


  constructor(private service:ApiServiceServiceService,
   ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(){
   this.service.get_service(ApiServiceServiceService.apiList.getAllusersUrl).subscribe((response)=>{
    console.log('response------>', response);   

    var responseData  = response;
    var resultObject = responseData['data'];
    this.data = resultObject;
   })
  }

  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false
  },
    columns : {
      fullName : { //Same as DTO name to iterate data
      title : 'Name'
    },
  
    sighnUpStarTimeStamp : {
    title : 'Initial Timestamp '
  },
  sighnUpEndTimeStamp : {
    title : 'Final Timestamp'
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
    title: 'asfasf',
    useBom: false,
    removeNewLines: true,
    keys: ['fullName', 'plan','mobileNumber' ]
  };

 
}
