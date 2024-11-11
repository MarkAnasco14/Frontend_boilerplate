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
    errorMessage: string = '';
    successMessage: string  = '';   // Property for error message
    submitting = false;
    loadingBranches = true;
    loadingBranchDetails = false;

    constructor(
        private branchService: BranchService,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }
    

    ngOnInit() {
        this.branchService.getAllBranches().pipe(first()).subscribe(branches => {
            this.branches = branches;
            this.loadingBranches = false;
        });
        this.accountService.getAll().pipe(first()).subscribe(accounts => (this.accounts = accounts));
        
    }
    resetSelection() {
        this.selectedBranchId = '';
        this.selectedAccountId = '';
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
        this.errorMessage = '';  // Reset error message before making API call
        this.successMessage = '';  // Reset success message before making API call
        if (this.selectedBranchId && this.selectedAccountId) {
            this.branchService
                .assignUserToBranch(this.selectedBranchId, this.selectedAccountId)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.successMessage = 'User assigned to branch successfully';  // Set success message
                        this.errorMessage = '';  // Clear any existing error message
                        setTimeout(() => this.successMessage = '', 3000); // Clear success message after 3 seconds
                    },
                    error: (error) => {
                        if (error.status === 400) {
                            this.errorMessage = 'Only a manager can be assigned to a branch';  // Set specific error message
                        } else {
                            this.errorMessage = 'user is already assigned or user is not a Manager';
                        }
                        setTimeout(() => {
                            this.errorMessage = ''; // Clear error message after 3 seconds
                        }, 3000); // Clear error message after 3 seconds
                    }
                });
        } else {
            this.errorMessage = 'Please select both a branch and a user.';  // Error for missing selection
            setTimeout(() => {
                this.errorMessage = ''; // Clear error message after 3 seconds
            }, 3000); // Clear error message after 3 seconds
        }
    }
   openBranchDetailsModal() {
    const modalElement = document.getElementById('branchDetailsModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.resetSelection(); // Reset selections when modal is closed
        });
    }
}
    getBranchDetails() {
        this.errorMessage = '';  // Reset error message before API call
        if (this.selectedBranchId) {
            this.loadingBranchDetails = true;
            this.branchService.getBranchById(this.selectedBranchId).pipe(first()).subscribe({
                next: (branch) => {
                    this.branchDetails = branch;
                    this.loadingBranchDetails = false;  // Stop loading once data is fetched
                    this.errorMessage = '';  // Clear any previous error
                },
                error: () => {
                    this.loadingBranchDetails = false;
                    this.alertService.error('Error fetching branch details');
                }
            });
        } else {
            this.alertService.error('Please select a branch');
        }
    }
    resetBranchDetails() {
        this.branchDetails = undefined;  // Clear branch details when modal is closed
    }
}