import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
declare var bootstrap: any;

import { BranchService , AccountService, AlertService} from '@app/_services';
import { Account, Branch } from '@app/_models';

@Component({ templateUrl: 'branch-list.component.html' })
export class BranchListComponent implements OnInit {
    branches?: any[];
    accounts?: Account[];
    selectedBranchId: string = '';
    selectedAccountId: string = '';
    branchDetails?: Branch; // Variable to hold branch details
    errorMessage: string = '';  // Property for error message

    constructor(
        private branchService: BranchService,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }
    

    ngOnInit() {
        this.branchService.getAllBranches().pipe(first()).subscribe(branches => (this.branches = branches));
        this.accountService.getAll().pipe(first()).subscribe(accounts => (this.accounts = accounts));
    }

    toggleDeactivateReactivateBranch(id: string) {
        const branch = this.branches!.find(x => x.id === id);
        
        if (branch.branchStatus === 'deactivated') {
            this.reactivateBranch(id, branch);
        } else {
            this.deactivateBranch(id, branch);
        }
    }
    
    deactivateBranch(id: string, branch: any) {
        branch.isDeactivating = true;  // Optional: to show loading indicator
        this.branchService.deactivateBranch(id)
            .pipe(first())
            .subscribe(() => {
                branch.branchStatus = 'deactivated';  // Update status
                branch.isDeactivating = false;
            });
    }
    
    reactivateBranch(id: string, branch: any) {
        branch.isReactivating = true;  // Optional: to show loading indicator
        this.branchService.reactivateBranch(id)
            .pipe(first())
            .subscribe(() => {
                branch.branchStatus = 'active';  // Update status
                branch.isReactivating = false;
            });
    }
    
    deleteBranch(id: string) {
        if (confirm('Are you sure you want to delete this branch?')) {
            const branch = this.branches!.find(x => x.id === id);
            branch.isDeleting = true;
            
            this.branchService.deleteBranch(id)
                .pipe(first())
                .subscribe(() => {
                    this.branches = this.branches!.filter(x => x.id !== id);
                    this.alertService.success('Branch deleted successfully', { keepAfterRouteChange: true });
                }, (error) => {
                    branch.isDeleting = false;
                    this.alertService.error('Error deleting branch');
                });
        }
    }
    assignUserToBranch() {
        if (this.selectedBranchId && this.selectedAccountId) {
            this.branchService
                .assignUserToBranch(this.selectedBranchId, this.selectedAccountId)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('User assigned to branch successfully');
                    },
                    error: () => {
                        this.alertService.error('only manager can be assign to branch');
                    }
                });
        }
    }
    openBranchDetailsModal() {
        const modalElement = document.getElementById('branchDetailsModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    getBranchDetails() {
        this.errorMessage = '';  // Reset error message before API call
        if (this.selectedBranchId) {
            this.branchService.getBranchById(this.selectedBranchId).pipe(first()).subscribe({
                next: (branch) => {
                    this.branchDetails = branch;
                    this.errorMessage = '';  // Clear any previous error
                },
                error: () => {
                    this.alertService.error('Error fetching branch details');
                }
            });
        } else {
            this.alertService.error('Please select a branch');
        }
    }
}