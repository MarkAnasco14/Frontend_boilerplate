import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
declare var bootstrap: any;

import { WarehouseService, AlertService, ProductService } from '@app/_services';
import { Warehouse, Product } from '@app/_models';

@Component({ templateUrl: 'warehouse-list.component.html' })
export class WarehouseListComponent implements OnInit {
    warehouseStock: Warehouse[] = [];
    lowStockItems: Warehouse[] = [];
    products: Product[] = [];
    loading = false;
    selectedWarehouse?: Warehouse;
    updatedQuantity = '';
    updatedMinimumLevel = '';
    showLowStockOnly = false;
    transferQuantity = ''; // New variable to store transfer quantity

    constructor(
        private warehouseService: WarehouseService,
        private productService: ProductService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        this.productService.getProduct()
            .pipe(first())
            .subscribe({
                next: (products) => {
                    this.products = products;
                    this.loadWarehouseStock();
                    this.loadLowStockItems();
                },
                error: () => {
                    this.alertService.error('Failed to load products');
                    this.loading = false;
                }
            });
    }

    loadWarehouseStock() {
        this.warehouseService.getWarehouseStock()
            .pipe(first())
            .subscribe({
                next: (warehouseStock) => {
                    this.warehouseStock = warehouseStock.map(item => ({
                        ...item,
                        product: this.products.find(product => product.id === item.productId)
                    }));
                    this.loading = false;
                },
                error: () => {
                    this.alertService.error('Failed to load warehouse stock');
                    this.loading = false;
                }
            });
    }

    loadLowStockItems() {
        this.warehouseService.getLowBulkStock()
            .pipe(first())
            .subscribe({
                next: (lowStockItems) => {
                    this.lowStockItems = lowStockItems.map(item => ({
                        ...item,
                        product: this.products.find(product => product.id === item.productId)
                    }));
                },
                error: () => {
                    this.alertService.error('Failed to load low stock items');
                }
            });
    }

    selectWarehouse(item: Warehouse) {
        this.selectedWarehouse = item;
        this.updatedQuantity = item.bulkQuantity;
        this.updatedMinimumLevel = item.minimumBulkLevel;
    }

    // Transfer stock to a store
    transferStock() {
        if (!this.selectedWarehouse) return;

        const productId = Number(this.selectedWarehouse.productId);
        const quantity = Number(this.transferQuantity);

        if (isNaN(productId) || isNaN(quantity)) {
            this.alertService.error('Invalid input: Ensure quantity is numeric');
            return;
        }

        this.warehouseService.transferToStore(productId, quantity)
            .pipe(first())
            .subscribe({
                next: (warehouse) => {
                    this.alertService.success('Stock transferred successfully');
                    this.loadWarehouseStock(); // Reload warehouse stock after transfer
                    this.closeModal('transferModal'); // Close the modal after transfer
                },
                error: (error) => {
                    this.alertService.error('Error transferring stock: ' + error);
                }
            });
    }

    updateBulkStock() {
        if (!this.selectedWarehouse) return;

        const productId = Number(this.selectedWarehouse.productId);
        const quantity = Number(this.updatedQuantity);

        if (isNaN(productId) || isNaN(quantity)) {
            this.alertService.error('Invalid input: Ensure quantity is numeric');
            return;
        }

        this.warehouseService.updateBulkStock(productId, quantity)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Bulk stock updated successfully');
                    this.loadWarehouseStock();
                    this.loadLowStockItems();
                    this.closeModal('updateStockModal');
                },
                error: (error) => {
                    this.alertService.error('Error updating bulk stock: ' + error);
                }
            });
    }

    updateMinimumLevel() {
        if (!this.selectedWarehouse) return;

        const productId = Number(this.selectedWarehouse.productId);
        const minimumLevel = Number(this.updatedMinimumLevel);

        if (isNaN(productId) || isNaN(minimumLevel)) {
            this.alertService.error('Invalid input: Ensure minimum level is numeric');
            return;
        }

        this.warehouseService.setMinimumBulkLevel(productId, minimumLevel)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Minimum level updated successfully');
                    this.loadWarehouseStock();
                    this.closeModal('minimumLevelModal');
                },
                error: (error) => {
                    this.alertService.error('Error updating minimum level: ' + error);
                }
            });
    }

    toggleLowStockFilter() {
        this.showLowStockOnly = !this.showLowStockOnly;
        if (this.showLowStockOnly) {
            this.loadLowStockItems();
        } else {
            this.loadWarehouseStock();
        }
    }

    private closeModal(modalId: string) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        }
        this.selectedWarehouse = undefined;
        this.updatedQuantity = '';
        this.updatedMinimumLevel = '';
        this.transferQuantity = ''; // Reset transfer quantity after closing the modal
    }
}
