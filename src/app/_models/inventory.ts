import { Product } from '@app/_models';

export interface Inventory {
    id?: number;
    productId: number;
    quantity: number;
    product?: Product; // Make sure to include the product details here
}