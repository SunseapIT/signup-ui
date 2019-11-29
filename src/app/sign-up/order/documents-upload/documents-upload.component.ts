import { Component, Host, OnInit } from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';

import { GoogleTagManagerService, UtilService } from '@app/core';
import { readFile } from '@app/shared';
import { OrderComponent } from '../order.component';
import { ORDER_GA_EVENT_NAMES, STORAGE_KEYS } from '../order.constant';

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
  ) {
    // Don't display step section 1, 2, 3 -> not display padding
    const element = document.getElementById('step-section');
    element.classList.remove('pt-3');

    
  }

  ngOnInit() {

    
  }
  
  onSubmit(form) {     
    this.parent.saveAndNext();
  }

  selectFile(event) {
    const document = event.document;
    if (document && document.name) {
      this.documents[document.name] = document;
      const documentName = document.name + '.' + document.file.name.split('.').pop();
      readFile(document.file).subscribe(
        content => this.utilService.uploadDocument(content, documentName, this.parent.token).subscribe(
          uploadedDocument => {
            this.documents[document.name].uploadedId = uploadedDocument.id;
            this.documents[document.name].file = null;
          },
          // rs => {
          //   if (_.get(rs, 'error.code') === ErrorCode.TokenFail) {
          //     this.parent.token = null;
          //     this.parent.openErrorModal('Errors',
          //       'Your session was expired. Please go back to previous page and verify your mobile again.');
          //   } else {
          //     this.parent.openErrorModal('Errors', _.get(rs, 'error.message'));
          //   }
          // }
        )
      );
    }
  }

  cancelUpload(event) {
    delete this.documents[event.documentName];
  }
}
