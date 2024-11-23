import { Component, OnInit } from '@angular/core';
import { AccountService, BranchService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';
import { Branch } from '@app/_models';

@Component({
    templateUrl: 'details.component.html'
})
export class DetailsComponent implements OnInit {
    account = this.accountService.accountValue;
    activityLogs: ActivityLog[] = [];
    filteredLogs: ActivityLog[] = [];
    branch: Branch | null = null;
    showActivityLogs = false;
    showBranchInfo: boolean = false;
    searchTerm: string = '';
    startDate: string = '';
    endDate: string = '';

    constructor(
        private accountService: AccountService,
        private branchService: BranchService
    ) {}

    ngOnInit(): void {
        if (this.account?.id) {
            this.getActivityLogs(this.account.id);
            if (this.account.BranchId) {
                this.getBranchById(this.account.BranchId);
            }
        }
    }

    getActivityLogs(accountId: string): void {
        this.accountService.getActivityLogs(accountId).subscribe(
            (logs) => {
                this.activityLogs = logs;
                this.filteredLogs = logs; // Initialize filtered logs
            },
            (error) => {
                console.error('Error fetching activity logs:', error);
            }
        );
    }

    handleSearch(): void {
        const startDate = this.startDate ? new Date(this.startDate).getTime() : null;
        const endDate = this.endDate ? new Date(this.endDate).getTime() : null;

        this.filteredLogs = this.activityLogs.filter((log) => {
            const logTimestamp = new Date(log.timestamp).getTime();
            const matchesSearchTerm = log.actionType.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesStartDate = !startDate || logTimestamp >= startDate;
            const matchesEndDate = !endDate || logTimestamp <= endDate;

            return matchesSearchTerm && matchesStartDate && matchesEndDate;
        });
    }

    getBranchById(branchId: string): void {
        this.branchService.getBranchById(branchId).subscribe(
            (branch) => {
                this.branch = branch;
            },
            (error) => {
                console.error('Error fetching branch:', error);
            }
        );
    }

    toggleActivityLogs(): void {
        this.showActivityLogs = !this.showActivityLogs;
    }

    toggleBranchInfo(): void {
        this.showBranchInfo = !this.showBranchInfo;
    }

    isManager(): boolean {
        return this.account?.role === 'Staff';
    }
}
