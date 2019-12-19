import { ApiServiceServiceService } from './../../../api-service-service.service';
import { Component, KeyValueDiffer } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Plandto } from '../dto/plan-dto';
import { Router } from '@angular/router';

declare const $:any;
export enum DocumentName { 
  factSheet = 'Plan Factsheet',
}
interface UploadDocument { 
  name: DocumentName; 
  file: File; 
  fileName: string; 
  uploadedId?: number; 
}


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
  model:any ={ planId : '', planName : '',  };
  uploadSuccess: boolean;
  uploaded:any;
  file:any;
  documentIds: number[] = [];
  factSheet:any={};
  isLoader:boolean;

  private onValidatorChange: () => void;
  private documentDiffer: KeyValueDiffer<string, any>;
  fileName: string;
  myfile: any;
  fileType:any;
  constructor(private service:ApiServiceServiceService,
    private router : Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }


  
  onSubmit(form:NgForm){ 
     if(form.valid && this.fileType == "application/pdf"){
      this.isLoader=true;
    this.uploadSuccess=false;
    var plandto = new Plandto()
    plandto.planName = this.model.planName;
    plandto.planId =  this.model.planId;    
  
  this.service.multiPartPost_service(ApiServiceServiceService.apiList.addPlanUrl
    +"?planName="+(btoa(this.model.planName))+"&planId="+this.model.planId,this.formData).subscribe
  (response=>{
    this.isLoader=false;
    let responseData = response;
    let statusCode = responseData['statusCode']
    if(statusCode == 200){

         this.router.navigateByUrl('/admin-login/admin-dash/view-plan')
         this.toastr.success('', 'Plan added successfully', {
          timeOut: 2000
          });
        }
        else if(statusCode == 500 || statusCode == 400){
       
          this.toastr.error('',responseData['message'], {
            timeOut : 3000
          }) 
        }
        
  })
  form.resetForm();
 }
 else{
    this.toastr.error('', 'All the fields are mandatory.', {
      timeOut: 3000
    });
   }
}


onFileSelected(event) { 
 this.myfile = event.target.files[0].name;
 this.fileType = event.target.files[0].type;
 if(this.fileType == "application/pdf"){
  this.formData.append("multipartFile", event.target.files[0]);   
  this.uploadSuccess=true;  
 }
 else{
  this.toastr.error('', 'Upload PDF file',{
    timeOut: 2000
  })
 }
}


cancelUpload(event) {
  delete this.documents[event.documentName];
}

}

