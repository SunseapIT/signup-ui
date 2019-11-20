import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { PlanBean } from '@app/core/plan-bean';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  planList =[];
  source: LocalDataSource;
  p:number=1;
  searchText : string;
 

  constructor(private service: ApiServiceServiceService,
    private toastr: ToastrService) {
      this.source = new LocalDataSource(this.planList);
     }

  ngOnInit() {
    this.getPlanList();
    
  }

  getPlanList(){
    this.service.get_service(ApiServiceServiceService.apiList.viewPlanUrl).subscribe((response)=>{
      var responseData  = response;
      var resultObject = responseData['data'];
      this.planList = resultObject;
     
      // this.plans = this.planList.map(plan =>plan.planName);
      
      console.log("plan list",this.planList);
            
    });
  
  }
  deletePlan(id){
    var data;
    let queryParams = new HttpParams();
    queryParams = queryParams.append("planId",id);
    this.service.post_service(ApiServiceServiceService.apiList.removePlansUrl+"?"+queryParams,data).subscribe((response)=>{
      var responseData  = response;
      var resultObject = responseData['data'];
      var planBean = new PlanBean();
      planBean = resultObject;
      var findIndex = this.planList.findIndex(plan =>plan.id === planBean.id);
      this.planList.splice(findIndex,1);

      this.toastr.error('', 'Plan deleted !', {
        timeOut: 2000
      });
      

    })

  }
  onSearch(query: string = '') {    
    this.source.setFilter(
      [                
      {        
        field: 'fullName',        
        search: query     
       },      
      {        
        field: 'sighnUpStarTimeStamp',        
        search: query     
       },      
      {        
        field: 'sighnUpEndTimeStamp',        
        search: query      
      }    
    ], false);  
  }

  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false
  },
    columns : {
      planName : { 
      title : 'Plan Name',
      filter: false
    },
    planId : { 
      title : 'Plan Code',
      filter: false
    },
  
    factSheetName : {
    title : 'Fact Sheet',
    filter: false
  }
 
  }
  }

}
