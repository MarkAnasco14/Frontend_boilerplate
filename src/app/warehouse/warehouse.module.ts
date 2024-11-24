import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseListComponent } from './warehouse-list.component';
import { WarehouseAddEditComponent } from './warehouse-add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        WarehouseRoutingModule,
        FormsModule
    ],
    declarations: [
        WarehouseListComponent,
        WarehouseAddEditComponent
    ],
    exports: [WarehouseListComponent] // Export to use in AppModule or routing
})
export class WarehouseModule { }