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
    availabilityInfo?: { product: string, available: boolean, quantity: number }; // Add this property
    errorMessage: string = ''; // Property for error message
    isDeactivating?: boolean;
    isReactivating?: boolean;
    isDeleting?: boolean;
    isAdminManager: boolean = false; // Flag to check if the user is a regular user
    isUser: boolean = false; // Flag to check if the user is a regular user
    filteredProducts: Product[] = [];
    searchQuery: string = ''; // Store search query
   

    constructor(
        private productService: ProductService,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }




    ngOnInit() {
        const account = this.accountService.accountValue;

        const Admin = 'Admin';
        const Staff = 'Staff';
    
        this.isAdminManager = account?.role === Admin || account?.role === Staff;
        this.isUser = account?.role === 'User';

        this.productService.getProduct()
            .pipe(first())
            .subscribe(products => {
                this.products = products;
                this.filteredProducts = products; // Initialize filtered products
            });
    }

   


    

    searchProducts() {
        if (this.searchQuery.trim()) {
            // Filter products based on search query
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            // If search query is empty, show all products
            this.filteredProducts = this.products;
        }
    }

    // print

    printReceipt() {
        const printContents = document.getElementById('receipt')?.innerHTML;
        if (printContents) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload the page to restore the original content
        } else {
            this.alertService.error('Unable to print receipt.');
        }
    }
    
    
    

    
    // Existing methods...


    // Toggle activation/deactivation of a product
    toggleDeactivateReactivateProduct(id: string) {
        const product = this.products.find(p => p.id === id);
    
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
                    product.productStatus = 'deactivated'; // Update UI
                    this.deactivatingProductId = null; // Reset after deactivation
                    this.alertService.success('Product deactivated successfully');
                },
                error: (error) => {
                    this.deactivatingProductId = null; // Reset on error
                    console.error('Error deactivating product:', error);
                    this.alertService.error(error);
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
            // Fetch product details
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
    getAvailabilityInfo(productId: string) {
        this.productService.checkAvailability(productId)
            .pipe(first())
            .subscribe({
                next: (availability) => {
                    this.availabilityInfo = { 
                        product: productId, 
                        available: availability.available, 
                        quantity: availability.quantity 
                    };
                },
                error: () => {
                    this.alertService.error('Error fetching availability information');
                }
            });
    }
}
