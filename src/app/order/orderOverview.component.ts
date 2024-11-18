import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService, AccountService , AlertService } from '@app/_services'; // Import AccountService

@Component({ templateUrl: 'orderOverview.component.html' })
export class OrderOverviewComponent implements OnInit {
    orders?: any[];
    selectedOrderStatus?: string; // To store the selected order status
    isUser: boolean = false; // Flag to check if the user is a regular user

    constructor(
        private orderService: OrderService,
        private accountService: AccountService,
        private alertService: AlertService // Inject AccountService
    ) { }

    ngOnInit(): void {
        const account = this.accountService.accountValue;
        this.isUser = account?.role === 'User';

        if (this.isUser) {
            this.loadOrders();
          }
      }
      loadOrders() {
        this.orderService.getAllOrders()
            .pipe(first())
            .subscribe(orders => this.orders = orders);
    }

      onOrderSelect(event: any) {
        const orderId = event.target.value;
        if (orderId) {
            this.trackOrderStatus(orderId);
        } else {
            this.selectedOrderStatus = undefined; // Reset status if no order is selected
        }
    }

    trackOrderStatus(id: string) {
        this.orderService.trackOrderStatus(id)
            .pipe(first())
            .subscribe({
                next: (status) => {
                    this.selectedOrderStatus = status;
                },
                error: () => {
                    this.alertService.error('Failed to track order status.');
                }
            });
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
}