import { Component, OnInit, Inject } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
declare const $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(   ) { }

  ngOnInit() {

  }
  
  plan:boolean;
  promo:boolean;
  audit:boolean;
 
  arrowChange(i){
    if(i == 1){
    this.plan=!this.plan;
     }
    else if(i == 2){
    this.promo=!this.promo;
     }
    else  if(i == 3){
      this.audit=!this.audit;
     }
   
  
  }

}
