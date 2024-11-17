import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryListComponent } from './inventory-list.component';
import { InventoryAddEditComponent } from './inventory-add-edit.component';

const routes: Routes = [
    { path: '', component: InventoryListComponent },
    { path: 'add', component: InventoryAddEditComponent },
    { path: 'edit/:id', component: InventoryAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }
