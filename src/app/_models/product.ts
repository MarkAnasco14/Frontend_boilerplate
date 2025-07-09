import { Account} from '@app/_models';

export interface Product {
    id?: string;
    waybillno: string;
    supplier: string;
    company: string;
    acceptedwarehouse: string;
    receivedby: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    productStatus?: string;
    AcountId?: string;  // Ensure this is set correctly when the account is fetched
}
