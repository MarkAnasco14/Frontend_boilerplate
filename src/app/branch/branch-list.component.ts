import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { BranchService , AlertService} from '@app/_services';

@Component({ templateUrl: 'branch-list.component.html' })
export class BranchListComponent implements OnInit {
    branches?: any[];

    constructor(private branchService: BranchService,
        private alertService: AlertService
    ) { }
    

    ngOnInit() {
        this.branchService.getAllBranches()
            .pipe(first())
            .subscribe(branches => this.branches = branches);
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
}