import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { OrderService , AlertService } from '@app/_services';

@Component({ templateUrl: 'order-list.component.html' })
export class OrderListComponent implements OnInit {
   orders?: any[];

   constructor(
    private orderService: OrderService,
    private alertService: AlertService

   ) { }

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
        .subscribe(
            () => {
                this.orders = this.orders!.filter(x => x.id !== id);
                this.alertService.success('Order cancelled successfully');
            },
            error => {
                order.isCancelling = false; // Reset state on error
                this.alertService.error('order is already ship or delivered');
            }
        );
}

processOrder(id: string) {
    const order = this.orders!.find(x => x.id === id);
    order.isProcess = true;
    this.orderService.processOrder(id)
        .pipe(first())
        .subscribe(
            () => {
                this.orders = this.orders!.filter(x => x.id !== id);
                this.alertService.success('Order processed successfully');
            },
            error => {
                order.isProcess = false; // Reset state on error
                this.alertService.error(error.message || 'Failed to process order');
            }
        );
}

shipOrder(id: string) {
    const order = this.orders!.find(x => x.id === id);
    order.isShip = true;
    this.orderService.shipOrder(id)
        .pipe(first())
        .subscribe(
            () => {
                this.orders = this.orders!.filter(x => x.id !== id);
                this.alertService.success('Order shipped successfully');
            },
            error => {
                order.isShip = false; // Reset state on error
                this.alertService.error(error.message || 'Failed to ship order');
            }
        );
}

deliverOrder(id: string) {
    const order = this.orders!.find(x => x.id === id);
    order.isDeliver = true;
    this.orderService.deliverOrder(id)
        .pipe(first())
        .subscribe(
            () => {
                this.orders = this.orders!.filter(x => x.id !== id);
                this.alertService.success('Order delivered successfully');
            },
            error => {
                order.isDeliver = false; // Reset state on error
                this.alertService.error(error.message || 'Failed to deliver order');
            }
        );
}
   
}