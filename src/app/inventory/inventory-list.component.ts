import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
declare var bootstrap: any;

import { InventoryService, AlertService , ProductService} from '@app/_services';
import { Inventory , Product} from '@app/_models';

@Component({ templateUrl: 'inventory-list.component.html' })
export class InventoryListComponent implements OnInit {
    inventory: Inventory[] = [];
    products: Product[] = [];
    loading = false;
    selectedInventory?: Inventory;
    updatedQuantity = 0;

    constructor(
        private inventoryService: InventoryService,
        private productService: ProductService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.productService.getProduct()
        .pipe(first())
        .subscribe(products => this.products = products);
        this.loadInventory();
    }
    // Load inventory from the API
    loadInventory() {
        this.loading = true;
        this.inventoryService.getInventory()
            .pipe(first())
            .subscribe({
                next: (data) => {
                    this.inventory = data;
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
        this.updatedQuantity = item.quantity; // Pre-fill with current quantity
        this.showModal();
    }

    // Update stock quantity
    updateStock() {
        if (!this.selectedInventory) return;

        const { productId } = this.selectedInventory;

        this.inventoryService.updateStock(productId, this.updatedQuantity)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Stock updated successfully');
                    this.loadInventory(); // Reload inventory list
                    this.closeModal();
                },
                error: (error) => {
                    this.alertService.error('Error updating stock: ' + error);
                }
            });
    }

    // Show modal for updating stock
    private showModal() {
        const modal = new bootstrap.Modal(document.getElementById('updateStockModal'));
        modal.show();
    }

    // Close modal after updating stock
    private closeModal() {
        const modalElement = document.getElementById('updateStockModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        }
        this.selectedInventory = undefined; // Clear selection
        this.updatedQuantity = 0;
    }
}
