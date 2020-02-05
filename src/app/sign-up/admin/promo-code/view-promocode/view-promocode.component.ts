import { ToastrService } from 'ngx-toastr';
import { Promocode } from './../../dto/promo-dto';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Component, OnInit } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-view-promocode',
  templateUrl: './view-promocode.component.html',
  styleUrls: ['./view-promocode.component.scss']
})
export class ViewPromocodeComponent implements OnInit {

  promoCodeData =[];
  public dateTimeRange: Date[];
  isLoader:boolean;
  searchText:any;
  promoCode:string;
  dateFrom:string;
  dateTo:string;
  noOfLimitedUsers:any;
  isInfinity:boolean= true;
  page:number;
  currentPage:number = 1;
  totalItems:any;

  constructor(private service : ApiServiceServiceService,
    private toastr : ToastrService,
    private router : Router) { }

  ngOnInit() {
    this.getPromoCode(0);

  }

  getPromoCode(page){
    this.isLoader=true
    this.service.get_service(ApiServiceServiceService.apiList.getPromoCodeUrl+"?page="+page).subscribe((response:any)=>{
      var responseBody = response['body'];
      var responseData = responseBody['data'];
      this.totalItems = responseData.totalElements;
      var responseContent = responseData['content'];
       this.promoCodeData = responseContent;
       this.isLoader=false;
    })
  }

  edit(id:number){
    this.router.navigate(['admin-login/admin-dash/edit',id]);
  }

  pageChanged(event: any): void {
    this.page = event.page-1;
    this.getPromoCode(this.page);
  }




  delete(id){

    this.service.get_service(ApiServiceServiceService.apiList.deletePromoCodeUrl+"?promoId="+id).subscribe((response)=>{
      var responseData  = response;
      var resultObject = responseData['data'];
      var promoCode = new Promocode();
      promoCode = resultObject;
      var findIndex = this.promoCodeData.findIndex(promoCodeId =>promoCodeId.id === promoCode.id);
      this.promoCodeData.splice(findIndex,1);
      this.toastr.success('', 'Promo Code has been successfully removed.', {
        timeOut: 2000
      });

      this.getPromoCode(0);
    })
  }

}
