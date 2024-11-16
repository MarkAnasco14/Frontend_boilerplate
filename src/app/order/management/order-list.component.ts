import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { OrderService } from '@app/_services';

@Component({ templateUrl: 'order-list.component.html' })
export class OrderListComponent implements OnInit {
   orders?: any[];

   constructor(private orderService: OrderService) { }

   ngOnInit() {
       this.orderService.getAllOrders()
           .pipe(first())
           .subscribe(orders => this.orders = orders);
   }

   cancelOrder(id: string) {
       const order = this.orders!.find(x => x.id === id);
       order.isCancelling = true;
       this.orderService.cancelOrder(id)
           .pipe(first())
           .subscribe(() => {
               this.orders = this.orders!.filter(x => x.id !== id)
           });
   }
}