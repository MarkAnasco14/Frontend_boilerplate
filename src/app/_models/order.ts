import { Account} from '@app/_models';

export interface Order {
    id: string;
    totalAmount: string;
    shippingAddress: string;
    orderStatus: string;
    createdAt: string;
    AcountId: string;
}