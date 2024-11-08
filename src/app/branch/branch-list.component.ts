import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { BranchService } from '@app/_services';

@Component({ templateUrl: 'branch-list.component.html' })
export class BranchListComponent implements OnInit {
    branches?: any[];

    constructor(private branchService: BranchService) { }

    ngOnInit() {
        this.branchService.getAllBranches()
            .pipe(first())
            .subscribe(branches => this.branches = branches);
    }

    deleteBranch(id: string) {
        const branch = this.branches!.find(x => x.id === id);
        branch.isDeleting = true;
        this.branchService.deleteBranch(id)
            .pipe(first())
            .subscribe(() => {
                this.branches = this.branches!.filter(x => x.id !== id);
            });
    }
}