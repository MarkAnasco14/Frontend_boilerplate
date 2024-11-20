import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
declare var bootstrap: any;

import { InventoryService, AlertService, ProductService } from '@app/_services';
import { Inventory, Product } from '@app/_models';

@Component({ templateUrl: 'inventory-list.component.html' })
export class InventoryListComponent implements OnInit {
    inventory: Inventory[] = [];
    products: Product[] = [];
    loading = false;
    selectedInventory?: Inventory;
    updatedQuantity = '';
    updatedReorderPoint = '';
    lowStockItems: Inventory[] = [];
    showLowStockOnly = false;

    constructor(
        private inventoryService: InventoryService,
        private productService: ProductService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loadInventory();
        this.loadLowStockItems();
    }

    loadInventory() {
        this.loading = true;
        this.inventoryService.getInventory()
            .pipe(first())
            .subscribe({
                next: (inventory) => {
                    this.productService.getProduct()
                        .pipe(first())
                        .subscribe({
                            next: (products) => {
                                this.products = products;
                                this.inventory = inventory.map(item => ({
                                    ...item,
                                    product: products.find(product => product.id === item.productId),
                                }));
                                this.loading = false;
                            },
                            error: () => {
                                this.alertService.error('Failed to load products');
                                this.loading = false;
                            },
                        });
                },
                error: () => {
                    this.alertService.error('Failed to load inventory');
                    this.loading = false;
                },
            });
    }

    loadLowStockItems() {
        this.inventoryService.getLowStock()
            .pipe(first())
            .subscribe({
                next: (lowStockItems) => {
                    this.productService.getProduct()
                    .pipe(first())
                    .subscribe({
                        next: (products) => {
                            this.products = products;
                            this.lowStockItems = lowStockItems.map(items => ({
                                ...items,
                                product: products.find(product => product.id === items.productId),
                            }));
                            this.loading = false;
                        },
                        error: () => {
                            this.alertService.error('Failed to load products');
                            this.loading = false;
                        },
                    });
            },
                error: () => {
                    this.alertService.error('Failed to load low stock items');
                }
            });
    }

    selectInventory(item: Inventory) {
        this.selectedInventory = item;
        this.updatedQuantity = item.quantity;
        this.updatedReorderPoint = item.reorderPoint.toString();
    }

    updateStock() {
        if (!this.selectedInventory) return;

        const productId = Number(this.selectedInventory.productId);
        const quantity = Number(this.updatedQuantity);

        if (isNaN(productId) || isNaN(quantity)) {
            this.alertService.error('Invalid input: Ensure quantity is numeric');
            return;
        }

        this.inventoryService.updateStock(productId, quantity)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Stock updated successfully');
                    this.loadInventory();
                    this.loadLowStockItems();
                    this.closeModal('updateStockModal');
                },
                error: (error) => {
                    this.alertService.error('Error updating stock: ' + error);
                },
            });
    }

    updateReorderPoint() {
        if (!this.selectedInventory) return;

        const productId = Number(this.selectedInventory.productId);
        const reorderPoint = Number(this.updatedReorderPoint);

        if (isNaN(productId) || isNaN(reorderPoint)) {
            this.alertService.error('Invalid input: Ensure reorder point is numeric');
            return;
        }

        this.inventoryService.setReorderPoint(productId, reorderPoint)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Reorder point updated successfully');
                    this.loadInventory();
                    this.closeModal('reorderPointModal');
                },
                error: (error) => {
                    this.alertService.error('Error updating reorder point: ' + error);
                },
            });
    }

    toggleLowStockFilter() {
        this.showLowStockOnly = !this.showLowStockOnly;
        if (this.showLowStockOnly) {
            this.loadLowStockItems();
        } else {
            this.loadInventory();
        }
    }
    private closeModal(modalId: string) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        }
        this.selectedInventory = undefined;
        this.updatedQuantity = '';
        this.updatedReorderPoint = '';
    }
}