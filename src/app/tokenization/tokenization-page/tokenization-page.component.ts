import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';


@Component({
  selector: 'app-tokenization-page',
  templateUrl: './tokenization-page.component.html',
  styleUrls: ['./tokenization-page.component.scss']
})
export class TokenizationPageComponent implements OnInit {

  constructor() { }
  modal:any={}

  months = ['jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
  years = [ 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  ngOnInit() {
  }

  onSubmit(form:NgForm){
    if(form.valid){
       
    }
  }

  onSelectMonth(event){
    let selectedMonth = event.target.value;
  }

  onSelectYear(event){
    let selectedYear = event.target.value;
  }
}
