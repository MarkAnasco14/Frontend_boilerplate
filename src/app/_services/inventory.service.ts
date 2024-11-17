import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Inventory } from '@app/_models';

const baseUrl = `${environment.apiUrl}/inventory`;

@Injectable({ providedIn: 'root' })
export class InventoryService {
    constructor(private http: HttpClient) { }

    // Get all inventory items with their associated product
    getInventory(): Observable<Inventory[]> {
        return this.http.get<Inventory[]>(baseUrl);
    }

    // Update stock quantity for a product
    updateStock(productId: number, quantity: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(baseUrl, { productId, quantity });
    }

    // Check availability of a product
    checkAvailability(productId: number): Observable<{ name: string; quantity: number }> {
        return this.http.get<{ name: string; quantity: number }>(`${baseUrl}/availability/${productId}`);
    }
}