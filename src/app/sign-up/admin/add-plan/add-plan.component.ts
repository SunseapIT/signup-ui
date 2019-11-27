import { OrderComponent } from './../../order/order.component';
import { ApiServiceServiceService } from './../../../api-service-service.service';

import { Component, KeyValueDiffer, KeyValueDiffers, DoCheck, Host } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

declare const $:any;

export enum DocumentName { 
  factSheet = 'Plan Factsheet',

}

interface UploadDocument { name: DocumentName; file: File; fileName: string; uploadedId?: number; }


const FACTSHEET_DOCUMENT_NAMES = [
  DocumentName.factSheet
 
];
@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent {

  DocumentName:any;

  documents: { [name: string]: UploadDocument } = {};
  document: { name: DocumentName, file: File, fileName: string, uploadedId?: number };
  
  formData=new FormData();
  model:any ={};
  uploadSuccess: boolean;
  uploaded:any;
  file:any;
  documentIds: number[] = [];

  factSheet:any={};

  private onValidatorChange: () => void;
  private documentDiffer: KeyValueDiffer<string, any>;
  fileName: string;
  myfile: any;
  constructor(  
 
    private service:ApiServiceServiceService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }


  
  onSubmit(form:NgForm){ 
     if(form.valid){

    this.uploadSuccess=false;
  
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

 this.myfile = event.target.files[0].name;
  this.formData.append("multipartFile", event.target.files[0]);   
  this.uploadSuccess=true;  
  
}


cancelUpload(event) {
  delete this.documents[event.documentName];
}


}

