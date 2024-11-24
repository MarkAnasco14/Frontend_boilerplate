import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { OrderService, AlertService , SalesService} from '@app/_services';
import { DailySales } from '@app/_models';

@Component({ templateUrl: 'order-list.component.html' })
export class OrderListComponent implements OnInit {
    orders?: any[];

    salesData?: DailySales; // For displaying daily sales
    isSalesModalOpen = false; // Modal toggle

    constructor(
        private orderService: OrderService,
        private alertService: AlertService,
        private salesService: SalesService
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
          // Fetch sales data by date
    fetchSalesData(date: string) {
        this.salesService.getDailySales(date)
            .pipe(first())
            .subscribe({
                next: sales => {
                    this.salesData = sales;
                    this.isSalesModalOpen = true; // Open the modal
                },
                error: () => {
                    this.alertService.error('Failed to fetch sales data');
                }
            });
    }

    // Close sales modal
    closeSalesModal() {
        this.isSalesModalOpen = false;
        this.salesData = undefined;
    }

}