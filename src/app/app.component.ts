import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ServiceService } from 'src/app/service/service.service';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  usuario: any;
  idOneSignal: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    private ws: ServiceService,
    private statusBar: StatusBar,
    private router: Router,
    private oneSignal: OneSignal
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initOneSignal();
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.ws.loginEvento.subscribe(data => {
        console.log('subcribe login evento');
            this.nativeStorage.setItem('usuario', data[0]);
            this.nativeStorage.setItem('carrito', []);
            this.usuario = data[0];
            console.log('usuario alerta login arreglo',this.usuario);
            //this.router.navigate(['tabs']);
            var datos = JSON.stringify({
              claveUsuario: data[0].claveCliente,
              claveNotificacion: this.idOneSignal
            });
            console.log(datos)
         this.ws.postHttp('updateClaveNotificacion', datos).then(data => {
            console.log(data)
           },
             error => {
               console.log('error post login');
               this.ws.presentAlert('Error','Error de conexión');
             });

            this.router.navigateByUrl('/tabs/tabs/tab2');
      });

      this.ws.registerEvent.subscribe(data => {
        console.log('subcribe register evento');
            //this.router.navigate(['tabs']);
            this.router.navigateByUrl('login');
      });

      this.ws.logout.subscribe(data => {
        
        this.nativeStorage.clear();
        this.router.navigateByUrl('login');
      });

    });
  }

  initOneSignal (){
    this.oneSignal.startInit('bcee564b-735c-4581-97d9-8088190b27d4', '903641907780');

    this.oneSignal.getIds().then((id) => {
      console.log(id);
      console.log('clave de notificacion');
      
      this.idOneSignal = id.userId; 
      console.log(this.idOneSignal)         
    }).catch(()=>{

    });

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    //llega notificacion y abre por automatico
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      switch(data.payload.additionalData.TipoNotificacion){
        case '8':
          this.ws.getChat.emit();
          break;

        default:
          break;
      }
    });

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      console.log('notificacion recibida');
      console.log(data);
      switch(data.notification.payload.additionalData.TipoNotificacion){
        case '2':
          this.ws.actualizaPedidos.emit();
          break;
        case '4':
          this.ws.actualizaPedidos.emit();
          break;
        case '5':
          this.ws.actualizaPedidos.emit();
          break;
        case '6':
          this.ws.actualizaPedidos.emit();
          break;
        case '7':
          this.ws.actualizaPedidos.emit();
          break;
        case '8':
          this.ws.getChat.emit();
          break;
          

        default:
          break;
      }
    });

    this.oneSignal.endInit();
            
  }
}
