import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductAddEditComponent } from './product-add-edit.component';

const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'add', component: ProductAddEditComponent },
    { path: 'edit/:id', component: ProductAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
