import { ApiServiceServiceService } from '@app/api-service-service.service';
import { CustomerDto } from './../../../core/customer-dto';
import { Component, Host, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';
import { GoogleTagManagerService, UtilService } from '@app/core';
import { OrderComponent } from '../order.component';
import { TimeStampDto } from '@app/sign-up/admin/dto/time-stamp-dto';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
})
export class DocumentsUploadComponent implements OnInit {

currentId: number = 0;
bill_data_file: any;
opening_letter_data_file: any;
authorization_data_file: any;

bill_data: string;
opening_letter_data: string;
authorization_data: string;

spPastMonthBill:any;
newSpAccountOpeningLetter:any;
letterOfAuthorisation:any;

newSpAccountOpeningLetterUploaded:boolean=false;
spPastMonthBillUploaded:boolean=false;
letterOfAuthorisationUploaded:boolean=false;

spPastMonthBillSuccess = false;
openingLetter = false;
authorization = false;



  constructor(
    @Host() public parent: OrderComponent,
    private service : ApiServiceServiceService,
    private toastr:ToastrService ) {
    const element = document.getElementById('step-section');
    element.classList.remove('pt-3');

    
  }

  ngOnInit() {

    
  }

  
  onSubmit(form:NgForm) {   
     if (this.spPastMonthBill || this.newSpAccountOpeningLetter || this.letterOfAuthorisation) {    
    var customerDto = new CustomerDto()
    var objStr = localStorage.getItem("customerObj");
    customerDto = JSON.parse(objStr);
    customerDto.file.bill_data = this.bill_data;
    customerDto.file.opening_letter_data = this.opening_letter_data;
    customerDto.file.authorization_data = this.authorization_data_file
    localStorage.setItem("customerObj",JSON.stringify(customerDto))

      var timeStampDto = new TimeStampDto();
      timeStampDto.pageType = "UPLOAD_DOCUMENTS";
      timeStampDto.token = localStorage.getItem("Token")

    this.service.post_service(ApiServiceServiceService.apiList.updateTimeUrl,timeStampDto).subscribe((response)=>{       
    })

      this.parent.saveAndNext();
    } 

    else{
      this.toastr.error('', 'Upload PDF file', {
        timeOut: 3000
      });
     }
  } 
    
  

selected(event,field){  
  this.currentId = field;
  let fileList : FileList = event.target.files;
  if (fileList.length > 0) {
    const file: File = fileList[0];    
    if (field == 1) {
      this.spPastMonthBill = file.name;
      this.bill_data_file = file;
      this.handleInputChange(file);
      this.spPastMonthBillSuccess = true;
      this.spPastMonthBillUploaded=true; 
    }
    else if (field == 2) {
      this.newSpAccountOpeningLetter=file.name;
      this.opening_letter_data_file = file;
      this.handleInputChange(file); 
      this.openingLetter = true;
      this.newSpAccountOpeningLetterUploaded=true;
    }
    else if (field == 3) {
      console.log();
      this.letterOfAuthorisation = file.name;
      this.authorization_data_file = file;
      this.handleInputChange(file); 
      this.authorization = true;
      this.letterOfAuthorisationUploaded=true;
    }
  } 
}

handleInputChange(files) {  
  var file = files;
  var pattern = /pdf-*/;
  var reader = new FileReader();
  if (!file.type.match(pattern)) {
    alert('invalid format');
    return;
  }
  reader.onloadend = this._handleReaderLoaded.bind(this);
  reader.readAsDataURL(file);
 
  
}

_handleReaderLoaded(e) {
  let reader = e.target;
  var base64result = reader.result.substr(reader.result.indexOf(',') + 1);

  let id = this.currentId;
  switch (id) {
    case 1:
      this.bill_data = base64result;
      break;
    case 2:
      this.opening_letter_data = base64result;
      break;
    case 3:
      this.authorization_data = base64result;
      break;
  
  }

}

removeFile(event,removeid){
console.log("removeFile : ",removeid);

  if(removeid == 1){

 this.spPastMonthBill=''
 this.spPastMonthBillSuccess = false;
 this.spPastMonthBillUploaded=false;
}
else if(removeid==2){
  this.newSpAccountOpeningLetter='';
  this.openingLetter = false;
  this.newSpAccountOpeningLetterUploaded=false;
}
else if(removeid ==3){
  this.letterOfAuthorisation='';
  this.authorization = false;
  this.letterOfAuthorisationUploaded=false;
  // this.isUploaded=false;

}
}  




  // selectFile(event) {
  //   this.myfile = event.document.file.name;
  // this.fileType = event.document.file.type;
  // if(this.fileType == "application/pdf"){
  // this.formData.append("multipartFile", event.document.file.name);   
    
  // }

  // }


}
