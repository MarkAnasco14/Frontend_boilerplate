// Angular Service for Branch Management
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Branch } from '@app/_models';

const baseUrl = `${environment.apiUrl}/branches`;

@Injectable({ providedIn: 'root' })
export class BranchService {
    private branchesSubject: BehaviorSubject<Branch[] | null>;
    public branches: Observable<Branch[] | null>;

    constructor(private http: HttpClient) {
        this.branchesSubject = new BehaviorSubject<Branch[] | null>(null);
        this.branches = this.branchesSubject.asObservable();
    }

    getAllBranches() {
        return this.http.get<Branch[]>(baseUrl)
            .pipe(map(branches => {
                this.branchesSubject.next(branches);
                return branches;
            }));
    }

    getBranchById(id: string) {
        return this.http.get<Branch>(`${baseUrl}/${id}`);
    }

    createBranch(branch: any) {
        return this.http.post(`${baseUrl}/create`, branch);
    }

    updateBranch(id: string, branch: any) {
        return this.http.put(`${baseUrl}/${id}`, branch);
    }

    deleteBranch(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }

    assignUserToBranch(branchId: string, accountId: string) {
        return this.http.post(`${baseUrl}/${branchId}/assign/${accountId}`, {});
    }

    removeUserFromBranch(branchId: string, accountId: string) {
        return this.http.post(`${baseUrl}/${branchId}/remove/${accountId}`, {});
    }

    updateBranchRole(branchId: string, role: string) {
        return this.http.put(`${baseUrl}/${branchId}/role`, { role });
    }

    deactivateBranch(id: string) {
        return this.http.put(`${baseUrl}/${id}/deactivate`, {});
    }

    reactivateBranch(id: string) {
        return this.http.put(`${baseUrl}/${id}/reactivate`, {});
    }
}
