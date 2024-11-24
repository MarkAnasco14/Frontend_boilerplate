import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { WarehouseService, AlertService } from '@app/_services';
import { Warehouse } from '@app/_models';

@Component({
    templateUrl: './warehouse-add-edit.component.html',
})
export class WarehouseAddEditComponent implements OnInit {
    warehouses: Warehouse[] = [];
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    selectedWarehouse?: Warehouse;

    constructor(
        private warehouseService: WarehouseService,
        private alertService: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.loadWarehouses();

        // Initialize form for updating warehouse stock and details
        this.form = this.formBuilder.group({
            productId: ['', Validators.required],
            bulkQuantity: [1, [Validators.required, Validators.min(0)]],
            minimumBulkLevel: [1, [Validators.required, Validators.min(0)]],
            location: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    // Load all warehouse stock
    loadWarehouses() {
        this.loading = true;
        this.warehouseService.getWarehouseStock()
            .pipe(first())
            .subscribe({
                next: (warehouses) => {
                    this.warehouses = warehouses;
                    this.loading = false;
                },
                error: (error) => {
                    this.alertService.error('Error loading warehouses: ' + error);
                    this.loading = false;
                }
            });
    }

    // Select a warehouse for editing
    selectWarehouse(warehouse: Warehouse) {
        this.selectedWarehouse = warehouse;
        this.form.patchValue({
            productId: warehouse.productId,
            bulkQuantity: warehouse.bulkQuantity,
            minimumBulkLevel: warehouse.minimumBulkLevel,
            location: warehouse.location,
            status: warehouse.status,
        });
    }

    // Update bulk stock for a selected warehouse
    onUpdateStock() {
        this.submitted = true;

        // Clear alerts on submit
        this.alertService.clear();

        // Stop if form is invalid
        if (this.form.invalid || !this.selectedWarehouse) {
            return;
        }

        this.submitting = true;

        const { productId, bulkQuantity } = this.form.value;

        this.warehouseService.updateBulkStock(Number(productId), Number(bulkQuantity))
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Bulk stock updated successfully');
                    this.loadWarehouses(); // Reload list
                    this.submitting = false;
                },
                error: (error) => {
                    this.alertService.error('Error updating stock: ' + error);
                    this.submitting = false;
                },
            });
    }

    // Set minimum bulk level for a selected warehouse
    onSetMinimumLevel() {
        this.submitted = true;

        // Clear alerts on submit
        this.alertService.clear();

        // Stop if form is invalid
        if (this.form.invalid || !this.selectedWarehouse) {
            return;
        }

        const { productId, minimumBulkLevel } = this.form.value;

        this.warehouseService.setMinimumBulkLevel(Number(productId), Number(minimumBulkLevel))
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Minimum bulk level updated successfully');
                    this.loadWarehouses(); // Reload list
                },
                error: (error) => {
                    this.alertService.error('Error updating minimum level: ' + error);
                },
            });
    }

    // Clear selection and reset form
    clearSelection() {
        this.selectedWarehouse = undefined;
        this.form.reset({
            bulkQuantity: 0,
            minimumBulkLevel: 0,
            status: '',
        });
    }
}