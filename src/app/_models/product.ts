import { Account} from '@app/_models';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: string;
    productStatus: string;
    AcountId: string;  // Ensure this is set correctly when the account is fetched
}