import { Component } from '@angular/core';

import { ORDER_ROUTES } from '../order.constant';
import { Router } from '@angular/router';
import { PAYMENT_ROUTES } from '@app/sign-up/tokenization/payment.constant';


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent {

  ORDER_ROUTES = ORDER_ROUTES;

  constructor(private router : Router) { }

  goToPayment(){
    this.router.navigateByUrl(PAYMENT_ROUTES.CARD_DETAIL);

  }
}
