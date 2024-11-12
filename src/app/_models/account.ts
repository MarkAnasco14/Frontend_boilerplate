import { Role } from './role';
import { Branch } from '@app/_models';

export class Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    jwtToken?: string;
    manager?: Account; // Optional, if the user has a manager
    branch?: Branch;  // Add branch here if the account has a branch assigned
}