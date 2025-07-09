import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
        private alertService: AlertService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // Define form with necessary fields
        this.form = this.formBuilder.group({
            waybillno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            supplier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            company: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            acceptedwarehouse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            receivedby: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            price: [1, [Validators.required, Validators.min(0)]],
            quantity: [1, [Validators.required, Validators.min(0)]],
            productStatus: ['active', Validators.required], // Dropdown for status
            rows: this.formBuilder.array([])
        });

        this.title = 'New Purchase Receipt';
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
   
      

    createRow(): FormGroup {
        return this.fb.group({
          waybillno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          supplier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            company: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            acceptedwarehouse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            receivedby: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          quantity: [null, [Validators.required, Validators.min(0)]],
          price: [null, [Validators.required, Validators.min(0)]]
        });
      }
    
    
    // Convenience getter for easy access to form fields
    get f() { return this.form.controls; }


     items(): FormArray {
        return this.form.get('rows') as FormArray;
      }
      get rows() {
        return (this.form.get('rows') as FormArray);
      }

    addRow() {
        this.rows.push(this.createRow());
    }

    onSubmit() {
        this.submitted = true;

        // Reset alerts on submit
        this.alertService.clear();

        // Stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveProduct()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Product saved successfully', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/product');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }

    private saveProduct() {
        // Create or update product based on whether we have an id
        return this.id
            ? this.productService.updateProduct(this.id, this.form.value)
            : this.productService.createProduct(this.form.value);
    }
}
