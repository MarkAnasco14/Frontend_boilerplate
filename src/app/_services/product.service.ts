import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';

const baseUrl = `${environment.apiUrl}/products`;

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    getProduct(): Observable<Product[]> {
        return this.http.get<Product[]>(baseUrl);
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${baseUrl}/${id}`);
    }

    createProduct(params: {
        name: string;
        description: string;
        price: number;
        quantity: number;
    }): Observable<any> {
        return this.http.post(baseUrl, params);
    }

    updateProduct(id: string, params: {
        name?: string;
        description?: string;
        price?: number;
        quantity?: number;
    }): Observable<any> {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    deactivateProduct(id: string): Observable<any> {
        return this.http.put(`${baseUrl}/${id}/deactivateProduct`, {});
    }

    reactivateProduct(id: string): Observable<any> {
        return this.http.put(`${baseUrl}/${id}/reactivateProduct`, {});
    }

    checkAvailability(productId: string): Observable<{
        product: string;
        available: boolean;
        quantity: number;
    }> {
        return this.http.get<{
            product: string;
            available: boolean;
            quantity: number;
        }>(`${baseUrl}/${productId}/availability`);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}