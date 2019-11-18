import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class SignUpComponent implements OnInit {
  title = 'consumer-portal';

  constructor() {
  }

  ngOnInit() {
  }
}
