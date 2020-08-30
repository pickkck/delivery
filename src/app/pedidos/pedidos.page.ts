import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRoute } from "@angular/router";
import { NavController, MenuController, LoadingController, AlertController, AngularDelegate } from '@ionic/angular';
import { ServiceService } from '../service/service.service';
import { ModalController } from '@ionic/angular';
import { SeguimientoPage } from '../seguimiento/seguimiento.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
	viewPedidos=1;
  pedidos: any;
  activos:any;
  historico: any;
  usuario: any;
  constructor(public alertController:AlertController, public modalCtrl:ModalController ,public nativeStorage: NativeStorage, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) {

    this.ws.actualizaPedidos.subscribe(() => {  
      console.log("vengo de notifiacion")
      this.pedidos = new Array();    
      this.getPedidos();  
      this.pruebaTime();
    });

   }


  ngOnInit() {
    this.nativeStorage.getItem('usuario').
  then(data =>
  {  
      console.log(data);
      this.usuario = data;
      this.getPedidos();
      this.getActivos(this.usuario.claveCliente);
      this.getHistorico(this.usuario.claveCliente);
  },
  error => {

  }
);
  }
  
  ionViewWillEnter(){
    this.nativeStorage.getItem('usuario').
      then(data =>
      {  
          console.log(data);
          this.usuario = data;
          this.getPedidos();
          this.getActivos(this.usuario.claveCliente);
          this.getHistorico(this.usuario.claveCliente);
          this.pruebaTime();
      },
      error => {

      }
    );

  }

  public pruebaTime(){
    console.log('prueba')
    var data = JSON.stringify({
        latitude: 'Aaron',
        longitude: 'Ramirez'
      });
    this.ws.postHttpP('pruebaTime', data).then(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    });
}


  async eliminaPedido(cveEstablecimiento, cveSucursal) {
    const alert = await this.alertController.create({
      header: 'Eliminar Pedido!',
      message: '¿Seguro que desea eliminar pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {

            var temp = new Array;
            this.nativeStorage.getItem('carrito').
            then(data =>
            {
              data.forEach(element => {
                if(element.id != cveEstablecimiento+'-'+cveSucursal){
                  temp.push(element);
                }
              });
              this.nativeStorage.setItem('carrito', temp);
            },
            error => {
              console.log(error)
            }
          );
          this.navCtrl.navigateForward(['/tabs/tabs/tab1']);
          }
        }
      ]
    });

    await alert.present();
  }

  public getActivos(claveCliente){
    this.activos= new Array;
    var data = JSON.stringify({
      claveCliente: claveCliente
      });

      this.ws.postHttp('getActivos', data).then(data => {
        try{
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              this.activos=data;
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

  public getHistorico(claveCliente){
    this.historico= new Array;
    var data = JSON.stringify({
      claveCliente: claveCliente
      });

      this.ws.postHttp('getHistorico', data).then(data => {
        try{
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              this.historico=data;
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

  segmentChanged(ev : any) {
    // console.log('Segment changed', ev);
    // this.viewPedidos = parseInt(ev.detail.value);
    if (this.viewPedidos == 1) {
      this.viewPedidos = 2;
    }else if (this.viewPedidos == 2) {
      this.viewPedidos = 1;
    }
  }

  public getPedidos(){
    this.nativeStorage.getItem('carrito').
      then(data =>
      {  
        this.pedidos = new Array;
        data.forEach(element => {
        var id = element.id.split('-');
        var cve1 = id[0];
        var cve2 = id[1];
        if(element.claveEstado!=0){
          this.actualizaDatos(cve1, cve2, element.clavePedido)
        }
        this.getInfoSuc(cve1, cve2, element);
        });
        console.log(this.pedidos);
      },
      error => {
        console.log(error)
      }
    );
  }

  
  public actualizaDatos(cveEstablecimiento, cveSucursal, cvePedido){
    var data = JSON.stringify({
      establecimiento: cveEstablecimiento,
      pedido: cvePedido
      });
      this.ws.postHttp('getEstado', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              

              this.nativeStorage.getItem('carrito').
                then(datos =>
                {
                  datos.forEach(element => {
                    if(element.id == cveEstablecimiento+'-'+cveSucursal){
                      element.claveEstado = data[0].claveEstatusPedido;
                      element.estado = data[0].estatus;
                    }
                  });
                  console.log('datos')
                  console.log(datos)
                  this.nativeStorage.setItem('carrito', datos);
                },
                error => {
                  console.log(error)
                }
              );


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
  
  public getInfoSuc(cveEst, cveSuc, pedido){
    var data = JSON.stringify({
      establecimiento: cveEst,
      sucursal: cveSuc
      });

      this.ws.postHttp('getInfoRestaurante', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              data.push(pedido.claveEstado);
              data.push(pedido.estado);
              data.push(pedido.clavePedido);
              
              this.pedidos.push(data);
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
          this.getPedidos();
        }
      }
    });

    return await modal.present();
  }


  public verCarrito(cveEstablecimiento, cveSucursal, cveEstado, cvePedido){
    console.log(cveEstablecimiento);
    console.log(cveSucursal)
    if(cveEstado==100){
      this.navCtrl.navigateForward(['/detalle-pedido',cveEstablecimiento,cvePedido,cveSucursal]);
    }else if(cveEstado==4 || cveEstado == 5){
      this.viewSeguimiento(cvePedido, cveEstablecimiento);
    }else if(cveEstado==0){
      this.navCtrl.navigateForward(['/carrito',cveEstablecimiento,cveSucursal]);
    }else{
      this.navCtrl.navigateForward(['/detalle-pedido',cveEstablecimiento,cvePedido,cveSucursal]);
    }
  }

  public verChat(claveEstablecimiento, clavePedido, mensajes){
    this.navCtrl.navigateForward(['/chat',claveEstablecimiento,clavePedido,mensajes]);
  }

}
