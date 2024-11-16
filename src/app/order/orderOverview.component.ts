import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService, AccountService } from '@app/_services'; // Import AccountService

@Component({ templateUrl: 'orderOverview.component.html' })
export class OrderOverviewComponent implements OnInit {
    orders?: any[];
    isUser: boolean = false; // Flag to check if the user is a regular user

    constructor(
        private orderService: OrderService,
        private accountService: AccountService // Inject AccountService
    ) { }

    ngOnInit(): void {
        const account = this.accountService.accountValue;
        this.isUser = account?.role === 'User';
      }
}