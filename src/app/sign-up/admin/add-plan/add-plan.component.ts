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

    this.uploadSuccess=false;
  
  this.service.multiPartPost_service(ApiServiceServiceService.apiList.addPlanUrl
    +"?planName="+this.model.planName+"&planId="+this.model.planId,this.formData).subscribe
  (response=>{
    
    console.log('------->',response);
    
    
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


// selectFile(event) {
//   const document = event.document;
//   if (document && document.name) {
//     this.documents[document.name] = document;
//     const documentName = document.name + '.' + document.file.name.split('.').pop();
//     readFile(document.file).subscribe(
//       content => this.utilService.uploadDocument(content, documentName, this.parent.token).subscribe(
//         uploadedDocument => {
//           this.documents[document.name].uploadedId = uploadedDocument.id;
//           this.documents[document.name].file = null;
//         },
//         rs => {
//           if (_.get(rs, 'error.code') === ErrorCode.TokenFail) {
//             this.parent.token = null;
//             this.parent.openErrorModal('Errors',
//               'Your session was expired. Please go back to previous page and verify your mobile again.');
//           } else {
//             this.parent.openErrorModal('Errors', _.get(rs, 'error.message'));
//           }
//         }
//       )
//     );
//   }
// }

cancelUpload(event) {
  delete this.documents[event.documentName];
}


}

