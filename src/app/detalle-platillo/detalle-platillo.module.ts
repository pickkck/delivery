import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePlatilloPageRoutingModule } from './detalle-platillo-routing.module';

import { DetallePlatilloPage } from './detalle-platillo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePlatilloPageRoutingModule
  ],
  declarations: [DetallePlatilloPage]
})
export class DetallePlatilloPageModule {}
