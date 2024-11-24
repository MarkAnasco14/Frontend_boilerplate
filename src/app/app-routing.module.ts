import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const branchModule = () => import('./branch/branch.module').then(x => x.BranchesModule); // Branch module import
const adminManagerModule = () => import('./order/adminManager.module').then(x => x.AdminManagerModule);
const productsModule = () => import('./product/product.module').then(x => x.ProductsModule);
const inventoryModule = () => import('./inventory/inventory.module').then(x => x.InventoryModule);
const warehouseModule = () => import('./warehouse/warehouse.module').then(x => x.WarehouseModule); // New Warehouse module import

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'branch', loadChildren: branchModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'order', loadChildren: adminManagerModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Staff, Role.User] } },
    { path: 'product', loadChildren: productsModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Staff, Role.User] } },
    { path: 'inventory', loadChildren: inventoryModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Staff] } },
    { path: 'warehouse', loadChildren: warehouseModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Staff] } }, // Warehouse route for Admin and Staff

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
