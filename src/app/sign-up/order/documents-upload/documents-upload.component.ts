import { ApiServiceServiceService } from '@app/api-service-service.service';
import { CustomerDto } from './../../../core/customer-dto';
import { Component, Host, OnInit } from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';

import { GoogleTagManagerService, UtilService } from '@app/core';
import { readFile } from '@app/shared';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES, STORAGE_KEYS } from '../order.constant';
import { timestamp } from 'rxjs/operators';
import { TimeStampDto } from '@app/sign-up/admin/dto/time-stamp-dto';

enum ErrorCode {
  TokenFail = 'E_TOKEN_FAIL',
}

export enum DocumentName { 
  SpPastMonthBill = 'SP Past Month Bill',
  NewSpAccountOpeningLetter = 'New SP Account Opening Letter',
  LetterOfAuthorisation = 'Letter of Authorisation by SP Account Holder', 
}

interface UploadDocument { name: DocumentName; file: File; fileName: string; uploadedId?: number; }

const SP_ACCOUNT_DOCUMENT_NAMES = [
  DocumentName.SpPastMonthBill, DocumentName.NewSpAccountOpeningLetter
];

const NON_SP_ACCOUNT_DOCUMENT_NAMES = [
  DocumentName.LetterOfAuthorisation
 
];

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
})
export class DocumentsUploadComponent implements OnInit {

  DocumentName = DocumentName;

  documents: { [name: string]: UploadDocument } = {};

  constructor(
    @Host() public parent: OrderComponent,
    private utilService: UtilService,
    private localStorage: LocalStorage,
    private gtagService: GoogleTagManagerService,
    private service : ApiServiceServiceService
  ) {
    // Don't display step section 1, 2, 3 -> not display padding
    const element = document.getElementById('step-section');
    element.classList.remove('pt-3');

    
  }

  ngOnInit() {

    
  }
  
  onSubmit(form) {   
 

      // if (form.valid) {    
        
      // this.parent.model.documentIds = _.chain(this.documents)
      //   .pick(this.parent.isSPAccountHolder ? SP_ACCOUNT_DOCUMENT_NAMES : NON_SP_ACCOUNT_DOCUMENT_NAMES)
      //   .values().map('uploadedId')
      //   .value();
      //   var customerDto = new CustomerDto();
      //   var strObj = localStorage.getItem("customerObj");
      //   customerDto = JSON.parse(strObj);
          



      // this.localStorage.setItem(STORAGE_KEYS.UPLOADED_DOCUMENT, this.documents).subscribe();
      // this.gtagService.sendEvent(ORDER_GA_EVENT_NAMES.UPLOAD_DOCUMENT);
    var customerDto = new CustomerDto()
    var objStr = localStorage.getItem("customerObj");
    customerDto = JSON.parse(objStr);

    customerDto.file.authorization_data = this.myfile

    localStorage.setItem("customerObj",JSON.stringify(customerDto))



      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "UPLOAD_DOCUMENTS";
      timeStampDto.token = localStorage.getItem("Token")

    this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{
      console.log('uploaddddddddddddddddd', response);
      
           
    })

      this.parent.saveAndNext();
    // }
  
    
  }
  fileName: string;
  myfile: any;
  fileType:any;
  formData=new FormData();
  selectFile(event) {
    this.myfile = event.document.file.name;
  this.fileType = event.document.file.type;
  if(this.fileType == "application/pdf"){
  this.formData.append("multipartFile", event.document.file.name);   
    
  }

  }

  cancelUpload(event) {
    delete this.documents[event.documentName];
  }
}
