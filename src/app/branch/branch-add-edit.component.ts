import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { BranchService, AlertService } from '@app/_services';

@Component({ templateUrl: 'branch-add-edit.component.html' })
export class BranchAddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private branchService: BranchService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            location: ['', Validators.required],
            isActive: [true]
        });

        this.title = 'Create Branch';
        if (this.id) {
            // edit mode
            this.title = 'Edit Branch';
            this.loading = true;
            this.branchService.getBranchById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        // create or update branch based on id param
        let saveBranch;
        let message: string;
        if (this.id) {
            saveBranch = () => this.branchService.updateBranch(this.id!, this.form.value);
            message = 'Branch updated';
        } else {
            saveBranch = () => this.branchService.createBranch(this.form.value);
            message = 'Branch created';
        }

        saveBranch()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/branch');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}