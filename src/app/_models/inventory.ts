import { Product } from '@app/_models';

// inventory.ts
export interface Inventory {
    id?: string;
    productId: string;
    quantity: string;
    reorderPoint: string;
    reorderStatus: 'none' | 'pending' | 'alerted';
    lastReorderAlert?: string;
    product?: Product;
}