import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { InventoryService, AlertService, ProductService } from '@app/_services';
import { Inventory } from '@app/_models';

@Component({
    templateUrl: './inventory-add-edit.component.html',
})
export class InventoryAddEditComponent implements OnInit {
    inventory: Inventory[] = [];
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    selectedInventory?: Inventory;
    products: any[] = [];

    constructor(
        private inventoryService: InventoryService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.loadProducts();

        // Initialize form for updating stock quantity
        this.form = this.formBuilder.group({
            productId: ['', Validators.required],
            quantity: [0, [Validators.required, Validators.min(0)]],
        });
    }

    loadProducts() {
        this.productService.getProduct()
            .pipe(first())
            .subscribe(products => {
                this.products = products.filter(p => p.productStatus === 'active');
            });
    }

    // Select an inventory item for update
    selectInventory(item: Inventory) {
        this.selectedInventory = item;
        this.form.patchValue({ quantity: item.quantity });
    }

    // Update inventory quantity
    onUpdate() {
        this.submitted = true;

        // Clear alerts on submit
        this.alertService.clear();

        // Stop if form is invalid
        if (this.form.invalid || !this.selectedInventory) {
            return;
        }

        this.submitting = true;

        const productId = Number(this.selectedInventory.productId); // Convert to number
        const quantity = Number(this.form.value.quantity); // Convert to number

        if (isNaN(productId) || isNaN(quantity)) {
            this.alertService.error('Invalid input: Ensure quantity and productId are numeric');
            this.submitting = false;
            return;
        }

        this.inventoryService.updateStock(productId, quantity)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Stock updated successfully');
                    this.loadProducts(); // Reload inventory list
                    this.submitting = false;
                },
                error: (error) => {
                    this.alertService.error('Error updating stock: ' + error);
                    this.submitting = false;
                },
            });
    }

    // Clear selection
    clearSelection() {
        this.selectedInventory = undefined;
        this.form.reset({ quantity: 0 });
    }
}
