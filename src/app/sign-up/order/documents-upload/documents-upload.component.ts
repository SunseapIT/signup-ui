import { ApiServiceServiceService } from "@app/api-service-service.service";
import { CustomerDto } from "./../../../core/customer-dto";
import { Component, Host, OnInit } from "@angular/core";
import * as _ from "lodash";
import { GoogleTagManagerService, UtilService } from "@app/core";
import { OrderComponent } from "../order.component";
import { TimeStampDto } from "../../../core/time-stamp-dto";
import { ToastrService } from "ngx-toastr";
import { NgForm } from "@angular/forms";

declare var $: any;

@Component({
  selector: "app-documents-upload",
  templateUrl: "./documents-upload.component.html",
})
export class DocumentsUploadComponent implements OnInit {
  currentId: number = 0;
  bill_data_file: any;
  opening_letter_data_file: any;
  authorization_data_file: any;
  sp_bill_data_file: any;
  authorization_fileName: any;

  bill_data: string;
  opening_letter_data: string;
  authorization_data: string;
  sp_bill_data: string;
  fileMaxSize = 500000;
  spPastMonthBillSize;
  newSpAccountOpeningLetterSize;
  letterOfAuthorisationSize;
  spBillDataSize;
  spPastMonthBill: any;
  newSpAccountOpeningLetter: any;
  letterOfAuthorisation: any;
  spBillLocName: any;

  newSpAccountOpeningLetterUploaded: boolean = false;
  spPastMonthBillUploaded: boolean = false;
  letterOfAuthorisationUploaded: boolean = false;
  spBilllocUploaded: boolean = false;

  spPastMonthBillSuccess = false;
  openingLetter = false;
  authorization = false;
  locAuthorized = false;

  constructor(
    @Host() public parent: OrderComponent,
    private service: ApiServiceServiceService,
    private toastr: ToastrService
  ) {
    const element = document.getElementById("step-section");
    element.classList.remove("pt-3");
  }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    if (this.parent.isSPAccountHolder &&
      (this.spPastMonthBill || this.newSpAccountOpeningLetter)) {
      if (
        this.spPastMonthBillSize > this.fileMaxSize || this.newSpAccountOpeningLetterSize > this.fileMaxSize
      ) {
        this.toastr.error("", "File size is too large.", {
          timeOut: 3000,
        });
      } else {
        this.saveDocuments();

      }
    } else if (
      !this.parent.isSPAccountHolder && this.letterOfAuthorisation && (this.spPastMonthBill || this.newSpAccountOpeningLetter)) {
      if (
        this.spPastMonthBillSize > this.fileMaxSize ||
        this.letterOfAuthorisationSize > this.fileMaxSize
      ) {
        this.toastr.error("", "File size is too large.", {
          timeOut: 3000,
        });
      } else {
        this.saveDocuments();
      }
    } else {
      this.toastr.error("", "Please upload document", {
        timeOut: 3000,
      });
    }
  }

  saveDocuments() {
    var customerDto = new CustomerDto();
    var objStr = localStorage.getItem("customerObj");
    customerDto = JSON.parse(objStr);
    customerDto.files.sp_bill_data = this.bill_data;
    customerDto.files.sp_bill_fileType = this.bill_data_file;
    customerDto.files.sp_bill_fileName = this.spPastMonthBill;
    customerDto.files.opening_letter_data = this.opening_letter_data;
    customerDto.files.opening_letter_fileType = this.opening_letter_data_file;
    customerDto.files.opening_letter_fileName = this.newSpAccountOpeningLetter;
    customerDto.files.authorization_data = this.authorization_data;
    customerDto.files.authorization_fileType = this.authorization_data_file;
    customerDto.files.authorization_fileName = this.letterOfAuthorisation
    // customerDto.files.spBillS3RefId=this.spBillS3RefId
    // customerDto.files.openingLetterS3RefId=this.openingLetterS3RefId
    // customerDto.files.authorizationS3RefId=this.authorizationS3RefId
    // customerDto.files.sp_bill_data = this.sp_bill_data;
    // customerDto.files.sp_bill_fileType = this.sp_bill_data_file;
    localStorage.setItem("customerObj", JSON.stringify(customerDto));
    var timeStampDto = new TimeStampDto();
    timeStampDto.pageType = "UPLOAD_DOCUMENTS";
    timeStampDto.token = localStorage.getItem("Token");
    this.service
      .post_service(
        ApiServiceServiceService.apiList.updateTimeUrl,
        timeStampDto
      )
      .subscribe((response) => { });
    this.parent.saveAndNext();
  }

  selected(event, field) {
    this.currentId = field;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // if (field == 1 && file.type == "application/pdf") {
      if (file.type == 'application/html') {

        this.toastr.error("", "Please upload in acceptable file format", {
          timeOut: 3000,
        });
      }
      if (
        field == 1 &&
        (file.type == "application/pdf" ||
          file.type == "image/jpeg" ||
          file.type == "image/png" ||
          file.type == "image/tiff" ||
          file.type == "image/gif" ||
          file.type == "application/msword" ||
          file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        this.spPastMonthBill = file.name;
        this.bill_data_file = file.type;
        this.spPastMonthBillSize = file.size;
        this.handleInputChange(file);
        this.spPastMonthBillSuccess = true;
        this.spPastMonthBillUploaded = true;
      } else if (
        field == 2 &&
        (file.type == "application/pdf" ||
          file.type == "image/jpeg" ||
          file.type == "image/png" ||
          file.type == "image/tiff" ||
          file.type == "image/gif" ||
          file.type == "application/msword" ||
          file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        this.newSpAccountOpeningLetter = file.name;
        this.opening_letter_data_file = file.type;
        this.newSpAccountOpeningLetterSize = file.size;
        this.handleInputChange(file);
        this.openingLetter = true;
        this.newSpAccountOpeningLetterUploaded = true;

      } else if (
        field == 3 &&
        (file.type == "application/pdf" ||
          file.type == "image/jpeg" ||
          file.type == "image/png" ||
          file.type == "image/tiff" ||
          file.type == "image/gif" ||
          file.type == "application/msword" ||
          file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        this.letterOfAuthorisation = file.name;
        this.authorization_data_file = file.type;
        this.letterOfAuthorisationSize = file.size;
        this.handleInputChange(file);
        this.authorization = true;
        this.letterOfAuthorisationUploaded = true;
      } else if (
        field == 4 &&
        (file.type == "application/pdf" ||
          file.type == "image/jpeg" ||
          file.type == "image/png" ||
          file.type == "image/tiff" ||
          file.type == "image/gif" ||
          file.type == "application/msword" ||
          file.type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        this.spBillLocName = file.name;
        this.sp_bill_data_file = file.type;
        this.spPastMonthBillSize = file.size;
        this.handleInputChange(file);
        this.locAuthorized = true;
        this.spBilllocUploaded = true;
      } else {
        this.toastr.error("", "Please upload in acceptable file format", {
          timeOut: 3000,
        });
      }
    }
  }

  handleInputChange(files) {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // spBillS3RefId:any
  //  openingLetterS3RefId:any
  //  authorizationS3RefId:any

  // uploadFileUrl = "https://31w0n4cnk1.execute-api.ap-south-1.amazonaws.com/thrymr/s3";

  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);

    let id = this.currentId;
    switch (id) {
        case 1:
        this.bill_data = base64result;
        // this.service.post_service(this.uploadFileUrl,this.bill_data).subscribe((response) => {
        //   console.log("Upload file ======", response);
        //   if(response.body.statusCode == 200){
        //     this.spBillS3RefId=response.body.data
        //     this.toastr.success(response.body.message)
        //   }
        //   else if(response.body.statusCode == 500){
        //     this.toastr.error(response.body.message)
        //   }
        // })
        break;
        case 2:
        this.opening_letter_data = base64result;
        // this.service.post_service(this.uploadFileUrl , this.opening_letter_data).subscribe((response) => {
        //   console.log("Upload file ======", response);
        //   if(response.body.statusCode == 200){
        //     this.openingLetterS3RefId=response.body.data
        //     this.toastr.success(response.body.message)
        //   }
        //   else if(response.body.statusCode == 500){
        //     this.toastr.error(response.body.message)
        //   }
        // })
        break;
        case 3:
        this.authorization_data = base64result;
        // this.service.post_service(this.uploadFileUrl , this.authorization_data).subscribe((response) => {
        //   console.log("Upload file ======", response);
        //   if(response.body.statusCode == 200){
        //     this.authorizationS3RefId=response.body.data
        //     this.toastr.success(response.body.message)
        //   }
        //   else if(response.body.statusCode == 500){
        //     this.toastr.error(response.body.message)
        //   }
        // })
        break;
        case 4:
        this.sp_bill_data = base64result;
        // this.service.post_service(this.uploadFileUrl, this.sp_bill_data).subscribe((response) => {
        //   console.log("Upload file ======", response);
        //   if(response.body.statusCode == 200){
        //     localStorage.setItem("datalambda",response.body.data)
        //     this.toastr.success(response.body.message)
        //   }
        //   else if(response.body.statusCode == 400 || response.body.statusCode == 500){
        //     this.toastr.error(response.body.message)
        //   }
        // })
        break;
    }
  }

  removeFile(event, removeid) {
    console.log(event)
    if (removeid == 1) {
      this.spPastMonthBill = null;
      this.bill_data_file = null;
      this.bill_data = ''
      this.spPastMonthBillSize = '';
      this.spPastMonthBillSuccess = false;
      this.spPastMonthBillUploaded = false;

    } else if (removeid == 2) {
      this.newSpAccountOpeningLetter = "";
      this.opening_letter_data_file = '';
      this.openingLetter = false;
      this.opening_letter_data = ''
      this.newSpAccountOpeningLetterUploaded = false;
      this.newSpAccountOpeningLetterSize = "";
    } else if (removeid == 3) {
      this.letterOfAuthorisation = "";
      this.authorization_data_file = '';
      this.authorization_data = ''
      this.authorization = false;
      this.letterOfAuthorisationUploaded = false;
      this.letterOfAuthorisationSize = "";
    } else if (removeid == 4) {
      this.spBillLocName = "";
      this.sp_bill_data_file = '';
      this.locAuthorized = false;
      this.spBilllocUploaded = false;
      this.spBillDataSize = "";
    }
  }
}
