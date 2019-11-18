import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { PlanBean } from '@app/core/plan-bean';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  planList =[];
 

  constructor(private service: ApiServiceServiceService,
    private toastr: ToastrService) { }

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

  settings = {
    actions: {
      edit: false,
      delete: true,
      add: false
  },
    columns : {
      planName : { //Same as DTO name to iterate data
      title : 'Plan Name'
    },
  
    sighnUpStarTimeStamp : {
    title : 'Fact Sheet'
  }
 
  }
  }

}
