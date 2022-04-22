import { Component } from '@angular/core';
import { ORDER_ROUTES } from '../order.constant';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent {

  ORDER_ROUTES = ORDER_ROUTES;

  constructor(private router : Router) { }

  goToPayment(){
    this.router.navigateByUrl(ORDER_ROUTES.PAYMENT);

  }
}
