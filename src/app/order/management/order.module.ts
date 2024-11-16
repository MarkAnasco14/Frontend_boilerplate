import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list.component';
import { OrderFormComponent } from './order-form.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        OrderRoutingModule
    ],
    declarations: [
        OrderListComponent,
        OrderFormComponent
    ]
})
export class OrderModule { }