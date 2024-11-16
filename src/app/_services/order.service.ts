import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Order } from '@app/_models';

const baseUrl = `${environment.apiUrl}/orders`;

@Injectable({ providedIn: 'root' })
export class OrderService {
    constructor(private http: HttpClient) { }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(baseUrl);
    }

    getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`${baseUrl}/${id}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(baseUrl, order);
    }

    updateOrder(id: string, params: any): Observable<any> {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    cancelOrder(id: string): Observable<Order> {
        return this.http.put<Order>(`${baseUrl}/${id}/cancel`, {});
    }

    trackOrderStatus(id: string): Observable<string> {
        return this.http.get<{ orderStatus: string }>(`${baseUrl}/${id}/status`)
            .pipe(map(response => response.orderStatus));
    }

    processOrder(id: string): Observable<any> {
        return this.http.put(`${baseUrl}/${id}/process`, {});
    }

    shipOrder(id: string): Observable<any> {
        return this.http.put(`${baseUrl}/${id}/ship`, {});
    }

    deliverOrder(id: string): Observable<any> {
        return this.http.put(`${baseUrl}/${id}/deliver`, {});
    }
}