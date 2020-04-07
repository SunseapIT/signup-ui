import { Component, OnInit } from '@angular/core';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  customerPlanDetail:any =[];

  constructor(private _service  : ApiServiceServiceService,
    private toastre : ToastrModule,
    private route : Router) { }

  ngOnInit() {
  }

  getCustomerDetailByEmail(){
    this._service.get_service(ApiServiceServiceService.apiList.getCustomerDetailsByEmail).subscribe(
      (response =>{
        console.log(response);
        
      })
    )
  }

}
