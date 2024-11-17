import { Component, OnInit } from '@angular/core';
import { InventoryService, AlertService } from '@app/_services';
import { Inventory } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({templateUrl: './inventory-add-edit.component.html',
})
export class InventoryAddEditComponent implements OnInit {
    inventory: Inventory[] = [];
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    selectedInventory?: Inventory;

    constructor(
        private inventoryService: InventoryService,
        private alertService: AlertService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.loadInventory();

        // Initialize form for updating stock quantity
        this.form = this.formBuilder.group({
            quantity: [0, [Validators.required, Validators.min(0)]]
        });
    }

    // Load inventory list
    private loadInventory() {
        this.loading = true;
        this.inventoryService.getInventory()
            .pipe(first())
            .subscribe({
                next: (inventory) => {
                    this.inventory = inventory;
                    this.loading = false;
                },
                error: (error) => {
                    this.alertService.error('Error loading inventory: ' + error);
                    this.loading = false;
                }
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

        const { productId } = this.selectedInventory;
        const { quantity } = this.form.value;

        this.inventoryService.updateStock(productId, quantity)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Stock updated successfully');
                    this.loadInventory(); // Reload inventory list
                    this.submitting = false;
                },
                error: (error) => {
                    this.alertService.error('Error updating stock: ' + error);
                    this.submitting = false;
                }
            });
    }

    // Clear selection
    clearSelection() {
        this.selectedInventory = undefined;
        this.form.reset({ quantity: 0 });
    }
}