import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Platform, IonContent } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from '../service/service.service';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { SeguimientoPage } from '../seguimiento/seguimiento.page';
import { map, catchError, finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('sessionDuration') durationElement:ElementRef;
  @ViewChild(IonContent) content: IonContent;
  
  cveEstablecimiento: any;
  bandera: boolean = true;
  cvePedido: any;
  mensajeNuevo = '';
  chats: any;
  cantidadChats = 5;
  i = 0;
  usuario: any;
  mensajes: any;
  mensaje = 'Chat';

  constructor(private ngZone: NgZone, public modalCtrl:ModalController, public nativeStorage: NativeStorage, public alertController: AlertController, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) {
    this.cveEstablecimiento = this.activateRoute.snapshot.paramMap.get('cveEst');
    this.cvePedido = this.activateRoute.snapshot.paramMap.get('cvePed');
    this.mensajes = this.activateRoute.snapshot.paramMap.get('mensajes');
    this.getChats(this.cveEstablecimiento, this.cvePedido, this.cantidadChats);
    this.ws.getChat.subscribe(() => {
      console.log('REFRESH CHAT')
      if(this.cvePedido != null)
      this.getChats(this.cveEstablecimiento, this.cvePedido, this.cantidadChats);
      this.ngZone.run(() => {
        this.chats = this.chats;
        this.mensaje = "Nuevo Mensaje"
      });
    });
   }

  ionViewDidEnter(){
    this.nativeStorage.getItem('usuario').
            then(data =>
                    {
                        console.log('DATOS EN PERFIL');
                        console.log(data);
                        this.usuario = data;
                        this.getChats(this.cveEstablecimiento, this.cvePedido, this.cantidadChats);
                    },
                    error => {

                    }
                );
  }

  ngOnInit() {
  }

  public getChats(cveEstablecimiento, cvePedido, cantidad){
    var data = JSON.stringify({
      establecimiento: cveEstablecimiento,
      pedido: cvePedido,
      cantidad: cantidad
      });
      console.log(data)
      this.ws.postHttp('getChats', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              this.chats = data;
              if(this.bandera==true){
                this.recorreAbajo();
              }else{
                this.bandera=true;
              }
            }
          }else{
            this.ws.presentAlert('Error','Ocurrio un error, intente nuevamente.');
          }
  
  
        }catch(e){           
          console.log('error de else login');
          this.ws.presentAlert('Error', 'Datos Invalidos');
        }
      },
        error => {
          console.log('error post login');
          this.ws.presentAlert('Error','Error de conexión');
        });
  }

  

  recorreAbajo(){
    setTimeout( () => {
      if(this.i == 1){
        this.getChats(this.cveEstablecimiento,this.cvePedido,this.cantidadChats);
        this.i=0;
      }
      this.content.scrollToBottom(500);
    },1000);
  }

  recorreoScroll(event: any) {
    this.bandera=false;
    this.cantidadChats= this.cantidadChats+5;
    this.getChats(this.cveEstablecimiento,this.cvePedido,this.cantidadChats);

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  enviarMensaje(){
    if(this.mensajeNuevo != ''){
      var data = JSON.stringify({
          cveEstablecimiento: this.cveEstablecimiento,
          cvePedido: this.cvePedido,
          cveUsuario: this.usuario.claveCliente,
          chat: this.mensajeNuevo
        });
      console.log(data)
      this.ws.postHttp('insertChat', data).then(data => {
        console.log('insert chat')
        console.log(data)
        this.mensajeNuevo ='';
        this.cantidadChats ++;
        this.getChats(this.cveEstablecimiento,this.cvePedido,this.cantidadChats);
        this.recorreAbajo();
      },
      error => {
        console.log(error);
      });
    }
  }


  async viewSeguimiento(pedido, establecimiento){
    //enviamos a pantalla de seguimiento del pedido
    // console.log(pedido);
    const modal = await this.modalCtrl.create({
      component: SeguimientoPage,
      componentProps: { 
         'pedido': pedido,
         'usrEstablecimiento': establecimiento
       }
    });

    modal.onDidDismiss().then((dataReturned) => {      
      if (dataReturned !== null) {
        if (dataReturned.data == undefined) {
          //console.log(dataReturned);
        }else{          
          console.log(dataReturned.data);
          this.getChats(this.cveEstablecimiento,this.cvePedido,this.cantidadChats);
        }
      }
    });

    return await modal.present();
  }

  public verCarrito(){ 
      this.viewSeguimiento(this.cvePedido, this.cveEstablecimiento);
  }

}
