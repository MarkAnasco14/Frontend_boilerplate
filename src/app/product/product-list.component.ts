import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
declare var bootstrap: any;

import { ProductService, AlertService, AccountService } from '@app/_services';
import { Product } from '@app/_models';

@Component({ templateUrl: 'product-list.component.html' })
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    deactivatingProductId: string | null = null;
    reactivatingProductId: string | null = null;
    deletingProductId: string | null = null;
    selectedProductId: string = '';
    productDetails?: Product; // Variable to hold product details
    errorMessage: string = ''; // Property for error message
    isDeactivating?: boolean;
    isReactivating?: boolean;
    isDeleting?: boolean; 
    isAdminManager: boolean = false; // Flag to check if the user is a regular user

    constructor(
        private productService: ProductService,
        private accountService: AccountService,
        private alertService: AlertService
        
    ) { }

    ngOnInit() {
        const account = this.accountService.accountValue;

        const Admin = 'Admin';
        const Manager = 'Manager';

        this.isAdminManager = account?.role === Admin || account?.role === Manager;
        
        this.productService.getProduct()
            .pipe(first())
            .subscribe(products => this.products = products);
        
    }

    // Toggle activation/deactivation of a product
    toggleDeactivateReactivateProduct(id: string) {
        const product = this.products.find(x => x.id === id);

        if (!product) {
            this.alertService.error('Product not found');
            return;
        }

        if (product.productStatus === 'deactivated') {
            this.reactivateProduct(id, product);
        } else {
            this.deactivateProduct(id, product);
        }
    }

    // Deactivate a product
    deactivateProduct(id: string, product: Product) {
        this.deactivatingProductId = id; // Set the ID of the deactivating product
        this.productService.deactivateProduct(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    product.productStatus = 'deactivated'; // Update status
                    this.deactivatingProductId = null; // Reset after deactivation
                    this.alertService.success('Product deactivated successfully');
                },
                error: () => {
                    this.deactivatingProductId = null; // Reset on error
                    this.alertService.error('Error deactivating product');
                }
            });
    }
    

    // Reactivate a product
    reactivateProduct(id: string, product: Product) {
        this.reactivatingProductId = id; // Set the ID of the reactivating product
        this.productService.reactivateProduct(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    product.productStatus = 'active'; // Update status
                    this.reactivatingProductId = null; // Reset after reactivation
                    this.alertService.success('Product reactivated successfully');
                },
                error: () => {
                    this.reactivatingProductId = null; // Reset on error
                    this.alertService.error('Error reactivating product');
                }
            });
    }
        

    // Open the modal to view product details
    openProductDetailsModal() {
        const modalElement = document.getElementById('productDetailsModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    // Fetch and display product details
    getProductDetails() {
        this.errorMessage = ''; // Reset error message before API call
        if (this.selectedProductId) {
            this.productService.getProductById(this.selectedProductId)
                .pipe(first())
                .subscribe({
                    next: (product) => {
                        this.productDetails = product;
                        this.errorMessage = ''; // Clear any previous error
                    },
                    error: () => {
                        this.alertService.error('Error fetching product details');
                    }
                });
        } else {
            this.alertService.error('Please select a product');
        }
    }
}
