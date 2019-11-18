import { ApiServiceServiceService } from './../../../api-service-service.service';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { DocumentName } from './../../order/documents-upload/documents-upload.component';
import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffer, KeyValueDiffers, DoCheck } from '@angular/core';
import { NgForm, AbstractControl, ValidationErrors, ControlValueAccessor, Validator, FormGroup } from '@angular/forms';
import { SubscriberDataBean } from '@app/subscriber-data-bean';
import { PlanBean } from '@app/core/plan-bean';
import { ToastrService } from 'ngx-toastr';
declare const $:any;
@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {
  document: { name: DocumentName, file: File, fileName: string, uploadedId?: number };
  @Input() documentName: DocumentName;
  @Input() isSubmitted: boolean;
  @Input() placeHolder: string;
  @Input() required: boolean;


  factSheet:any={};
  @Output() selectFile: EventEmitter<any> = new EventEmitter();
 // @Output() upload: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  formData=new FormData();
  model:any ={};
  uploadSuccess: boolean;
  uploaded:any;

  private onValidatorChange: () => void;
  private documentDiffer: KeyValueDiffer<string, any>;
  fileName: string;
  src = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  constructor(  private differs: KeyValueDiffers,
    private service:ApiServiceServiceService,
    private http : HttpClient,
    private toastr: ToastrService) { }

  ngOnInit() {
  }


  file:any;
  
  onSubmit(form:NgForm){ 
  //  if(form.valid){
  //   var planBean = new  PlanBean();
  //   planBean.planId =form.value.planId;
  //   planBean.planName = form.value.planName;
  //   this.service.post_service(ApiServiceServiceService.apiList.addPlanUrl,planBean).subscribe((response)=>{
  //     this.toastr.success('', 'Plan added successfully', {
  //       timeOut: 2000
  //     });
         
  //   })
  //  }
  //  else{
  //   this.toastr.error('', 'Fill the form', {
  //     timeOut: 3000
  //   });
  //  }
  //   form.resetForm();

  if(form.valid){
  this.service.multiPartPost_service(ApiServiceServiceService.apiList.addPlanUrl
    +"?planName="+this.model.planName+"&planId="+this.model.planId,this.formData).subscribe
  (response=>{
    
    this.toastr.success('', 'Plan added successfully', {
         timeOut: 2000
         });
  })
 }
 else{
    this.toastr.error('', 'Fill the form', {
      timeOut: 3000
    });
   }
    form.resetForm();
}



onFileSelected(event) {

  this.uploaded = event.target.files[0].name;
  this.formData.append("multipartFile", event.target.files[0]); 
  
  this.uploadSuccess=true;
 
  
  
}

}

