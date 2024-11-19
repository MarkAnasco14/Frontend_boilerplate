import { Product } from '@app/_models';

export interface Inventory {
    id?: string;
    productId: string;
    quantity: string;
    product?: Product; // Make sure to include the product details here
}