import { Product } from '@app/_models';

// inventory.ts
export interface Warehouse {
    id?: string;
    productId: string;
    bulkQuantity: string;
    minimumBulkLevel: string;
    location: string;
    status: string;
    lastRestockDate: string;
    product?: Product;
}