import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP } from "@ionic-native/http/ngx";
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


import { SeguimientoPage } from './seguimiento/seguimiento.page';
@NgModule({
  declarations: [AppComponent, SeguimientoPage],
  entryComponents: [SeguimientoPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpModule],
  providers: [
    UniqueDeviceID,
    AndroidPermissions,
    Uid,
    StatusBar,
    SplashScreen,
    NativeStorage,
    HTTP,
    Geolocation,
    OneSignal,
    PayPal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
