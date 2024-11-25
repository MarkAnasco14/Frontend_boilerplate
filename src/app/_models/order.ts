import { Account} from '@app/_models';

export interface Order {
    id: string;
    totalAmount: string;
    quantity: string;
    payment: string;
    shippingAddress: string;
    salesChannel: string;
    orderStatus: string;
    createdAt: string;
    AcountId: string;
}