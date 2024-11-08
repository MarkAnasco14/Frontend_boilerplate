export interface Branch {
    id: string;
    name: string;
    location: string;
    isActive: boolean;
    isDeactivating?: boolean;
    isReactivating?: boolean;
}