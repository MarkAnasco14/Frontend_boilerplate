import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchListComponent } from './branch-list.component';
import { BranchAddEditComponent } from './branch-add-edit.component';

const routes: Routes = [
    { path: '', component: BranchListComponent },
    { path: 'add', component: BranchAddEditComponent },
    { path: 'edit/:id', component: BranchAddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchesRoutingModule { }