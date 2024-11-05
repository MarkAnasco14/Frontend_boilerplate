import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts?: any[];
    activityLogs: ActivityLog[] = [];
    showActivityLogs = false; // Initialize it


    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);

            const accountId = this.accountService.accountValue?.id!;
            this.getActivityLogs(accountId);
    }

    getActivityLogs(accountId: string) {
        this.accountService.getActivityLogs(accountId)
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

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts!.filter(x => x.id !== id)
            });
    }
}