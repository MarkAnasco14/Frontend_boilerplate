import { Component, OnInit } from '@angular/core';
import { AccountService , OrderService ,BranchService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  Role = Role;
  account?: Account | null;
  branch?: any;  // Define the branch property

  constructor(
    private accountService: AccountService,
    private branchService: BranchService  // Inject BranchService to fetch branch data
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    if (this.account?.role === Role.Admin) {
      // Fetch branch details if the account is Admin
      this.branchService.getAllBranches().subscribe(branches => {
        // Assuming you want to display the first branch, or you can add your own logic
        if (branches && branches.length > 0) {
          this.branch = branches[0];  // You can customize this if you need to select a specific branch
        }
      });
    }
  }

  logout() {
    this.accountService.logout();
  }
}
