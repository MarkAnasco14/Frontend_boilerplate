import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderSubNavComponent } from './orderSubnav.component';
import { OrderLayoutComponent } from './orderLayout.component';
import { OrderOverviewComponent } from './orderOverview.component';

const orderModule = () => import('./management/order.module').then(x => x.OrderModule);

const routes: Routes = [
    { path: '', component: OrderSubNavComponent, outlet: 'subnav' },
    {
        path: '', component: OrderLayoutComponent,
        children: [
            { path: '', component: OrderOverviewComponent },
            { path: 'management', loadChildren: orderModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminManagerRoutingModule { }