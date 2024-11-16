import { Account} from '@app/_models';

export interface Order {
    id: string;
    orderProduct: string;
    totalAmount: string;
    shippingAddress: string;
    orderStatus: string;
    AcountId: string;  // Ensure this is set correctly when the account is fetched
}