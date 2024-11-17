import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryListComponent } from './inventory-list.component';
import { InventoryAddEditComponent } from './inventory-add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InventoryRoutingModule,
        FormsModule
    ],
    declarations: [
        InventoryListComponent,
        InventoryAddEditComponent
    ],
    exports: [InventoryListComponent] // Export to use in AppModule or routing
})
export class InventoryModule { }
