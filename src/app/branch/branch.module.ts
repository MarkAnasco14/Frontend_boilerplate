import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BranchesRoutingModule } from './branch-routing.module';
import { BranchListComponent } from './branch-list.component';
import { BranchAddEditComponent } from './branch-add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BranchesRoutingModule,
        FormsModule
    ],
    declarations: [
        BranchListComponent,
        BranchAddEditComponent
    ],
    exports: [BranchListComponent] // Export to use in AppModule or routing
})
export class BranchesModule { }
