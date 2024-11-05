import { Component } from '@angular/core';

import { AccountService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    account = this.accountService.accountValue;
    activityLogs: ActivityLog[] = [];
    showActivityLogs = false; // Initialize it

    ngOnInit(): void {
        // Call getActivityLogs when component initializes
        if (this.account && this.account.id) {
            this.getActivityLogs(this.account.id); // Pass the account ID to get the logs
        }
    }
    getActivityLogs(AccountId: string) {
        this.accountService.getActivityLogs(AccountId)
            .subscribe(
                (logs) => {
                    console.log('Fetched logs:', logs); // Log entire logs response
                    this.activityLogs = logs;
                },
                (error) => {
                    console.error('Error fetching activity logs:', error);
                }
            ); 
    }
    toggleActivityLogs() {
        this.showActivityLogs = !this.showActivityLogs; // Toggle visibility
    }

    constructor(private accountService: AccountService) { }
}