import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { DailySales } from '@app/_models';

const baseUrl = `${environment.apiUrl}/sales`;

@Injectable({ providedIn: 'root' })
export class SalesService {
    constructor(private http: HttpClient) { }

    getDailySales(date?: string): Observable<DailySales> {
        return this.http.get<DailySales>(`${baseUrl}/daily`);
    }

    getDateRangeSales(startDate: string, endDate: string): Observable<DailySales[]> {
        return this.http.get<DailySales[]>(`${baseUrl}/range`, {
            params: { startDate, endDate }
        });
    }

    updateSales(): Observable<DailySales> {
        return this.http.post<DailySales>(`${baseUrl}/update`, {});
    }
}