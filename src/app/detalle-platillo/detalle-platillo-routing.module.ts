import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePlatilloPage } from './detalle-platillo.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePlatilloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePlatilloPageRoutingModule {}
