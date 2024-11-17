import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list.component';
import { ProductAddEditComponent } from './product-add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductsRoutingModule,
        FormsModule
    ],
    declarations: [
        ProductListComponent,
        ProductAddEditComponent
    ],
    exports: [ProductListComponent] // Export to use in AppModule or routing
})
export class ProductsModule { }
