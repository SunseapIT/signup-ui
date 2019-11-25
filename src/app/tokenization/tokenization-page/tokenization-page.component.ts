import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tokenization-page',
  templateUrl: './tokenization-page.component.html',
  styleUrls: ['./tokenization-page.component.scss']
})
export class TokenizationPageComponent implements OnInit {

  constructor() { }

  months = ['jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
  years = [ 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  ngOnInit() {
  }

}
