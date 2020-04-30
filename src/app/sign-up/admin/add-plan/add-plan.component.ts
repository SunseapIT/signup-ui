import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, KeyValueDiffer } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Plandto } from '../dto/plan-dto';
import { Router } from '@angular/router';

declare const $: any;


@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {
  formData: any;
  model: any = { planId: '', planName: '', energy: '', discount: '', rateChange: '', rate: '', afterGst: '', planInMonths : ''  , planType: '' };
  uploadSuccess: boolean;
  file: any;
  isLoader: boolean;
  bill_data: string;
  spPastMonthBill: any;
  bill_data_file: any;
  fileName: string;
  myfile: any;
  fileType: any;
  selectedPlanType:any;
  selectedContractTerm:any;
  contractMonths:any;
  planTypeOthers:boolean;
  months = [ "3", "6", "12", "other"];
  message
  msgModal = { message: '' }
  constructor(private service: ApiServiceServiceService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAdminMessage();
    // this.contractMonths = 1;
    // for (let i=0; i<24; i++){
    // this.months.push(this.contractMonths+i);
    // }
    // console.log('this.months',this.months);
    
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.fileType == "application/pdf") {
      this.isLoader = true;
      this.uploadSuccess = false;
      var plandto = new Plandto()
      plandto = this.model;
      console.log('plandto ',plandto );
      
      let sendlbeFormData = new FormData();
      sendlbeFormData.append("multipartFile", this.formData);
      sendlbeFormData.append("planDto", JSON.stringify(plandto));
      this.service.post_service(ApiServiceServiceService.apiList.addPlanUrl, sendlbeFormData).subscribe
        (response => {
          var responseBody = response['body'];
          var responseMessage = responseBody['message'];
          let statusCode = responseBody['statusCode']
          if (statusCode == 200) {
            this.isLoader = false;
            this.router.navigateByUrl('/admin-login/admin-dash/view-plan')
            this.toastr.success('', 'Plan added successfully', {
              timeOut: 2000
            });
          }
          else if (statusCode == 500 || statusCode == 400) {
            this.isLoader = false;

            this.toastr.error('', responseMessage, {
              timeOut: 3000
            })
          }
        })
      form.resetForm();
    }
    else {
      this.toastr.error('', 'All the fields are mandatory.', {
        timeOut: 3000
      });
    }
  }

  onFileSelected(event) {
    this.myfile = event.target.files[0].name;
    this.fileType = event.target.files[0].type;
    if (this.fileType == "application/pdf") {
      this.formData = event.target.files[0];
      this.uploadSuccess = true;
    }
    else {
      this.toastr.error('', 'Upload PDF file', {
        timeOut: 2000
      })
    }
  }


  addMessage() {
    this.message = this.msgModal.message;
    console.log(this.message)
    this.service.get_service(ApiServiceServiceService.apiList.messageUrl + "?message=" + (btoa(this.message))).subscribe((response) =>
     {
      this.toastr.success('', 'Message added successfully.', {
        timeOut: 2000
      })
      this.message=''
    })
  }

  getAdminMessage() {
    this.service.get_service(ApiServiceServiceService.apiList.getMessageUrl).subscribe((response) => {
      this.msgModal.message = response['data'];
    })
  }

  deleteMessage() {
    this.msgModal.message = "";
    this.message = this.msgModal.message;
    this.service.get_service(ApiServiceServiceService.apiList.messageUrl + "?message=" + (btoa(this.message))).subscribe((response) => {
      this.toastr.error('', 'Message deleted successfully.', {
        timeOut: 2000
      })
    })
  }


  selected(event) {
    let fileList: FileList = event.target.files;
    const file: File = fileList[0];
    this.bill_data_file = file;
    this.handleInputChange(file);
  }

  handleInputChange(files) {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.bill_data = base64result;
  }

  onSelectContractTerm(event){
   this.selectedContractTerm=event.target.value;
  }

  onSelectPlanType(event){
   this.selectedPlanType= event.target.value;
    // var selected = event.target.value;
    // if(selected == "others"){
    //   this.planTypeOthers = true;
    // }
    // else{
    //   this.planTypeOthers = false;
    // }
    

  }


}

