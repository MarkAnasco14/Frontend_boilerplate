import { Account} from '@app/_models';

export interface Branch {
    id: string;
    name: string;
    location: string;
    branchStatus: string;
    Accounts: Account[]; // Accounts is an array of Account objects
}
