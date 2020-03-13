import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment'
@Component({
  selector: 'app-add-promocode',
  templateUrl: './add-promocode.component.html',
  styleUrls: ['./add-promocode.component.scss']
})
export class AddPromocodeComponent implements OnInit {
  model: any = { promoCode: '', dateFrom: '', dateTo: '', infinity: "true", noOfLimitedUsers: '' };
  public dateTimeRange: any[];
  isLoader: boolean;
  responseData: any = {}
  min = new Date();
  hour12Timer: boolean = false

  constructor(private service: ApiServiceServiceService,
    private dateFormat: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) { }



  ngOnInit() {
    this.responseData.infinity = "true";
    this.getPromoCodeById();
  }


  getPromoCodeById() {
    let id = this.activatedRoute.snapshot.params['id'];
    if (id != null) {
      this.service.get_service(ApiServiceServiceService.apiList.getPromoCodeById + "?promoId=" + id).subscribe((response: any) => {
        var responseBody = response['body'];
        var responseData = responseBody['data'];
        var responseContent = responseData['content'];
        let datefrom: any[] = []
        datefrom.push(moment(responseData.dateFrom, "DD-MM-YYYY,H:mm:ss").format())
        datefrom.push(moment(responseData.dateTo, "DD-MM-YYYY,H:mm:ss").format())
        this.responseData = responseData;
        this.responseData.infinity = this.responseData.infinity ? "true" : "false";
        this.dateTimeRange = datefrom;
      })
    }
  }


  getTimeStamp(time) {
    return this.dateFormat.transform(time, "dd-MM-yyyy H:mm:ss");
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.responseData.dateFrom = this.getTimeStamp(this.dateTimeRange[0])
      this.responseData.dateTo = this.getTimeStamp(this.dateTimeRange[1])
      this.responseData.noOfLimitedUsers = this.responseData.infinity ? null : this.responseData.noOfLimitedUsers;
      if (this.dateTimeRange[0] && this.dateTimeRange[1]) {
        this.isLoader = true;
        this.service.post_service(ApiServiceServiceService.apiList.addPromoCodeUrl, this.responseData).subscribe((response) => {
          this.isLoader = true;
          var responseBody = response['body'];
          var responseData = responseBody['data'];
          let statusCode = responseBody['statusCode'];
          var responseMsg = responseBody['message'];
          if (statusCode == 200) {
            this.isLoader = false;
            this.router.navigateByUrl('/admin-login/admin-dash/view-promo');
            this.toastr.success('', 'Promo Code added successfully');
            form.resetForm();
          }
          else {
            this.toastr.error('', responseMsg);
            this.isLoader = false;

          }
        })

      } else {
        this.toastr.error('', 'Please fill the form.');
      }
    }
    else {
      this.toastr.error('', 'Please fill the form.');
    }
  }
}
