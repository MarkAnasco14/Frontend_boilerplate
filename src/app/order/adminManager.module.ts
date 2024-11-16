import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminManagerRoutingModule } from './adminManager-routing.module';
import { OrderSubNavComponent } from './orderSubnav.component';
import { OrderLayoutComponent } from './orderLayout.component';
import { OrderOverviewComponent } from './orderOverview.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminManagerRoutingModule
    ],
    declarations: [
        OrderSubNavComponent,
        OrderLayoutComponent,
        OrderOverviewComponent
    ]
})
export class AdminManagerModule { }