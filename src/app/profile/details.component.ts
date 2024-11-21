import { Component, OnInit } from '@angular/core';
import { AccountService, BranchService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';
import { Branch, Account } from '@app/_models'; // Import Branch and Account models

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    account = this.accountService.accountValue;
    activityLogs: ActivityLog[] = [];
    branch: Branch | null = null; // Declare branch as null initially
    showActivityLogs = false;
    showBranchInfo: boolean = false;  // Controls visibility of branch info

    constructor(
        private accountService: AccountService,
        private branchService: BranchService // Use BranchService here
    ) { }
    
    ngOnInit(): void {
        // Call getActivityLogs when component initializes
        if (this.account && this.account.id) {
            this.getActivityLogs(this.account.id);

              // Ensure the account has a branch and use the branch id to fetch the branch
              if (this.account.BranchId) {  // Updated to match the correct property name
                this.getBranchById(this.account.BranchId); // Use branchId from account
            } else {
                console.warn('No branchId assigned to account:', this.account.id);
            }
          }
      }

    getActivityLogs(AccountId: string): void {
        this.accountService.getActivityLogs(AccountId)
            .subscribe(
                (logs) => {
                    this.activityLogs = logs;
                },
                (error: any) => { // Explicitly type error as 'any'
                    console.error('Error fetching activity logs:', error);
                }
            );
    }

    getBranchById(BranchId: string): void {
        this.branchService.getBranchById(BranchId)
          .subscribe(
            (branch: Branch) => {
              
              this.branch = branch;
            },
            (error: any) => {
              console.error('Error fetching branch:', error);
            }
          );
    }

    toggleActivityLogs(): void {
        this.showActivityLogs = !this.showActivityLogs;
    }

    toggleBranchInfo() {
        this.showBranchInfo = !this.showBranchInfo;
      }
      isManager(): boolean {
        return this.account?.role === 'Staff'; // Check account role instead of branch
    }
}
