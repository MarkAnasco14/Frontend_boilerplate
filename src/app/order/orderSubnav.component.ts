import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services'; // Adjust the path as necessary

@Component({
  templateUrl: 'orderSubnav.component.html',
})
export class OrderSubNavComponent implements OnInit {
  isAdminOrManager = false;

  constructor(
    private accountService: AccountService
) {}

  ngOnInit(): void {
    const account = this.accountService.accountValue;
    this.isAdminOrManager = account?.role === 'Admin' || account?.role === 'Staff';
  }
}