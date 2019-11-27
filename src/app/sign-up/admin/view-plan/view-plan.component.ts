import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { PlanBean } from '@app/core/plan-bean';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


declare const $:any;

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  planList =[];
  p:number=1;
  searchText : string;
  pdfSrc: any;
  planName:string = '';
 

  constructor(private service: ApiServiceServiceService, private toastr: ToastrService) {
    for (let i = 1; i <= 100; i++) {
      this.planList.push(`item ${i}`);
    }
  }

  ngOnInit() {
    this.getPlanList();
    
  }

  getPlanList(){
    this.service.get_service(ApiServiceServiceService.apiList.viewPlanUrl).subscribe((response)=>{
      var responseData  = response;
      var resultObject = responseData['data'];
      this.planList = resultObject;           
    });  
  }
  
  deletePlan(id){

    
    // var data;
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append("planId",id);
    // this.service.post_service(ApiServiceServiceService.apiList.removePlansUrl+"?"+queryParams,data).subscribe((response)=>{
    //   var responseData  = response;
    //   var resultObject = responseData['data'];
    //   var planBean = new PlanBean();
    //   planBean = resultObject;
    //   var findIndex = this.planList.findIndex(plan =>plan.id === planBean.id);
    //   this.planList.splice(findIndex,1);

    //   this.toastr.error('', 'Plan deleted !', {
    //     timeOut: 2000
    //   }); 

    // })

  }
  
 
viewFactSheet(name){
  this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet+"?planName="+name).subscribe(response=>{
    var data = "data:application/pdf;base64," +response['data']
    this.pdfSrc = data;
    
  })
  $("#myModal").modal("show")
}

 

}
