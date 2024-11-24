import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

import { Warehouse } from '@app/_models';

const baseUrl = `${environment.apiUrl}/warehouse`;

@Injectable({ providedIn: 'root' })
export class WarehouseService {
    constructor(private http: HttpClient) {}

    // Get all warehouse stock
    getWarehouseStock(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(baseUrl);
    }

    // Update bulk stock for a product
    updateBulkStock(productId: number, quantity: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${baseUrl}/bulk-update`, { productId, quantity });
    }

    // Transfer stock to a store
    transferToStore(productId: number, quantity: number): Observable<Warehouse> {
        return this.http.post<Warehouse>(`${baseUrl}/transfer`, { productId, quantity });
    }

    // Check warehouse levels for a specific product
    checkWarehouseLevels(productId: number): Observable<{ id: number; levels: number }> {
        return this.http.get<{ id: number; levels: number }>(`${baseUrl}/levels/${productId}`);
    }

    // Set minimum bulk level for a product
    setMinimumBulkLevel(productId: number, minimumLevel: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${baseUrl}/minimum-level`, { productId, minimumLevel });
    }

    // Get items with low stock
    getLowBulkStock(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${baseUrl}/low-stock`);
    }
}