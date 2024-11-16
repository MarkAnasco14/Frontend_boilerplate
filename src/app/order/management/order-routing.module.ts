import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list.component';
import { OrderFormComponent } from './order-form.component';

const routes: Routes = [
 { path: '', component: OrderListComponent },
 { path: 'add', component: OrderFormComponent },
 { path: 'edit/:id', component: OrderFormComponent }
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})
export class OrderRoutingModule { }