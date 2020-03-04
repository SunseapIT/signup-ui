import { PlanBean } from './../../../core/plan-bean';
import { HttpParams } from '@angular/common/http';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


declare const $: any;

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  planList = [];
  p: number = 1;
  searchText: string;
  pdfSrc: any;
  planName: string = '';
  isLoader: boolean = false;;
  totalItems: any;
  page: number;
  currentPage: number = 1;


  constructor(private service: ApiServiceServiceService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.getPlanList(0);

  }

  getPlanList(page) {
    this.isLoader = true;
    this.service.get_service(ApiServiceServiceService.apiList.viewPlanUrl + "?page=" + page).subscribe((response: any) => {
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      this.totalItems = responseData.totalElements;
      var responseContent = responseData['content'];
      let status = responseBody['statusCode'];
      if (status == 200) {
        this.planList = responseContent;
        this.isLoader = false;
      }
      else {
        this.isLoader = false;
      }

    });
  }

  delete(id) {
    var data;
    let queryParams = new HttpParams();
    queryParams = queryParams.append("planId", id);
    this.service.post_service(ApiServiceServiceService.apiList.removePlansUrl + "?" + queryParams, data).subscribe((response) => {
      var responseData = response;
      var resultObject = responseData['data'];
      // var planBean = new PlanBean();
      // planBean = resultObject;
      // var findIndex = this.planList.findIndex(plan =>plan.id === planBean.id);
      // this.planList.splice(findIndex,1);

      this.toastr.success('', 'Plan has been successfully removed.', {
        timeOut: 2000
      });

      this.getPlanList(0);
    })
  }


  viewFactSheet(name) {
    this.service.getFactSheetGet_service(ApiServiceServiceService.apiList.getFactSheet
      + "?planName=" + (btoa(name))).subscribe(response => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];

        var data = "data:application/pdf;base64," + responseData
        this.pdfSrc = data;

      })
    $("#myModal").modal("show")
  }

  pageChanged(event: any): void {
    this.page = event.page - 1;
    this.getPlanList(this.page);
  }

}
