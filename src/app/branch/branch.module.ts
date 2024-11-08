import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branch-routing.module';
import { BranchListComponent } from './branch-list.component';
import { BranchAddEditComponent } from './branch-add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BranchesRoutingModule
    ],
    declarations: [
        BranchListComponent,
        BranchAddEditComponent
    ]
})
export class BranchesModule { }