import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatillosPageRoutingModule } from './platillos-routing.module';

import { PlatillosPage } from './platillos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatillosPageRoutingModule
  ],
  declarations: [PlatillosPage]
})
export class PlatillosPageModule {}
