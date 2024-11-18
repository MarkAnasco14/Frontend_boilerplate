import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { OrderService, AlertService } from '@app/_services';

@Component({ templateUrl: 'order-list.component.html' })
export class OrderListComponent implements OnInit {
    orders?: any[];

    constructor(
        private orderService: OrderService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.orderService.getAllOrders()
            .pipe(first())
            .subscribe(orders => this.orders = orders);
    }

    cancelOrder(id: string) {
        const order = this.orders!.find(x => x.id === id);
        order.isCancelling = true;
        this.orderService.cancelOrder(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.loadOrders(); // Reload orders to get updated status
                    this.alertService.success('Order cancelled successfully');
                },
                error: error => {
                    order.isCancelling = false;
                    this.alertService.error('Order is already shipped or delivered');
                }
            });
    }

    processOrder(id: string) {
        const order = this.orders!.find(x => x.id === id);
        order.isProcessing = true;
        this.orderService.processOrder(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.loadOrders();
                    this.alertService.success('Order processed successfully');
                },
                error: error => {
                    order.isProcessing = false;
                    this.alertService.error(error.message || 'Failed to process order');
                }
            });
    }

    shipOrder(id: string) {
        const order = this.orders!.find(x => x.id === id);
        order.isShipping = true;
        this.orderService.shipOrder(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.loadOrders();
                    this.alertService.success('Order shipped successfully');
                },
                error: error => {
                    order.isShipping = false;
                    this.alertService.error(error.message || 'Failed to ship order');
                }
            });
    }

    deliverOrder(id: string) {
        const order = this.orders!.find(x => x.id === id);
        order.isDelivering = true;
        this.orderService.deliverOrder(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.loadOrders();
                    this.alertService.success('Order delivered successfully');
                },
                error: error => {
                    order.isDelivering = false;
                    this.alertService.error(error.message || 'Failed to deliver order');
                }
            });
    }
}