import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ngx-captcha';

@Component({
  selector: 'app-test-captch',
  templateUrl: './test-captch.component.html',
  styleUrls: ['./test-captch.component.scss']
})
export class TestCaptchComponent implements OnInit {
  captcha="";
  siteKey = "6Le8F-QUAAAAANLvdpKtY5jb_RrH2vToFAp4y_M1";

  constructor(private reCaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit() {
    this.reCaptchaV3Service.execute(this.siteKey,  "recaptcha", (token) => {
    useGlobalDomain: false
  });
  
}
handleReset(){}
handleSuccess(event){
this.captcha = event;  
}

handleExpire(){
  this.captcha="";    
}

handleLoad(){}

}
