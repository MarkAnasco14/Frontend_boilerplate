import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService, AccountService , AlertService } from '@app/_services'; // Import AccountService

@Component({ templateUrl: 'orderOverview.component.html' })
export class OrderOverviewComponent implements OnInit {
    orders: any[] = []; // Initialize as an empty array
    isUser: boolean = false; // Flag to check if the user is a regular user
    filteredOrders: any[] = [];
    selectedStatus: string = '';

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
          .subscribe({
            next: (orders) => {
              this.orders = orders;
            },
            error: () => {
              this.alertService.error('Failed to load orders.');
            },
          });
      }

      filterOrders() {
        if (!this.selectedStatus) {
          // Show all orders if no status is selected
          this.filteredOrders = [...this.orders];
        } else {
          // Filter by selected status
          this.filteredOrders = this.orders.filter(
            (order) => order.orderStatus === this.selectedStatus
          );
        }
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