import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListComponent } from './warehouse-list.component';
import { WarehouseAddEditComponent } from './warehouse-add-edit.component';

const routes: Routes = [
    { path: '', component: WarehouseListComponent },
    { path: 'add', component: WarehouseAddEditComponent },
    { path: 'edit/:id', component: WarehouseAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule { }