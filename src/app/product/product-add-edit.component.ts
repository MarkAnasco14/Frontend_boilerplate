import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ProductService, AlertService } from '@app/_services';

@Component({ templateUrl: 'product-add-edit.component.html' })
export class ProductAddEditComponent implements OnInit {
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
        private productService: ProductService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // Define form with necessary fields
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            price: [1, [Validators.required, Validators.min(0)]],
            bulkQuantity: [1, [Validators.required, Validators.min(0)]],
            productStatus: ['active', Validators.required], // Dropdown for status
        });

        this.title = 'Create Product';
        if (this.id) {
            // Edit mode
            this.title = 'Edit Product';
            this.loading = true;
            this.productService.getProductById(this.id)
                .pipe(first())
                .subscribe({
                    next: (product) => {
                        this.form.patchValue(product);
                        this.loading = false;
                    },
                    error: () => this.loading = false
                });
        }
    }

    // Convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // Clear alerts on submit
        this.alertService.clear();

        // Stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        // Create or update product based on id param
        let saveProduct;
        let message: string;
        if (this.id) {
            saveProduct = () => this.productService.updateProduct(this.id!, this.form.value);
            message = 'Product updated successfully';
        } else {
            saveProduct = () => this.productService.createProduct(this.form.value);
            message = 'Product created successfully';
        }

        saveProduct()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/product');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}
