import { Account} from '@app/_models';

export interface Order {
    id: string;
    orderProduct: string;
    totalAmount: string;
    shippingAddress: string;
    orderStatus: string;
    AcountId: string;
}