import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, AlertController, ModalController } from '@ionic/angular';

import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuario: any;
  constructor(private uniqueDeviceID: UniqueDeviceID, public nativeStorage: NativeStorage,
    public platform: Platform,
    //public events: Events,
    private ws: ServiceService,
    private modalCtrl:  ModalController,
    public alertCtrl: AlertController,
    private router: Router
    ) { }


  ngOnInit() {
  }

  ionViewWillEnter(){
    this.uniqueDeviceID.get()
  .then((uuid: any) => console.log(uuid))
  .catch((error: any) => console.log(error));
    this.nativeStorage.getItem('usuario').
      then(data =>
      {  
          console.log(data);
          this.usuario = data;
      },
      error => {

      }
    );

  }

  cerraSesion(){
    var datos = JSON.stringify({
      claveUsuario: this.usuario.claveCliente,
      claveNotificacion: null
    });

 this.ws.postHttp('updateClaveNotificacion', datos).then(data => {
  this.ws.logout.emit();
   },
     error => {
       console.log('error post login');
       this.ws.presentAlert('Error','Error de conexión');
     });
    console.log('evento logout');
  }

}
