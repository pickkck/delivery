import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from '../service/service.service';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-platillos',
  templateUrl: './platillos.page.html',
  styleUrls: ['./platillos.page.scss'],
})
export class PlatillosPage implements OnInit {
  cveEstablecimiento = null;
  cveSucursal = null; 
  platillos: any;
  restaurante: any;
  items = 0;
  constructor(public nativeStorage: NativeStorage, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) { 
  }

  ngOnInit() {
    this.cveEstablecimiento = this.activateRoute.snapshot.paramMap.get('cveEst');
    this.cveSucursal = this.activateRoute.snapshot.paramMap.get('cveSuc');
    this.getPlatillos(this.cveEstablecimiento, this.cveSucursal);
    this.getInfo(this.cveEstablecimiento, this.cveSucursal);
    console.log(this.platillos)
  }

  ionViewWillEnter(){
    this.getPlatillos(this.cveEstablecimiento, this.cveSucursal);
    this.revisaCarrito(this.cveEstablecimiento, this.cveSucursal);
  }

  public getPlatillos(cveEst, cveSuc){
    var data = JSON.stringify({
      establecimiento: cveEst,
      sucursal: cveSuc
      });

      this.ws.postHttp('getPlatillos', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              this.platillos=data;
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
  
  public getInfo(cveEst, cveSuc){
    var data = JSON.stringify({
      establecimiento: cveEst,
      sucursal: cveSuc
      });

      this.ws.postHttp('getInfoRestaurante', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              this.restaurante=data;
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

  public verCarrito(cveEstablecimiento, cveSucursal){
    console.log(cveEstablecimiento);
    console.log(cveSucursal)
    this.navCtrl.navigateForward(['/carrito',cveEstablecimiento,cveSucursal]);
  }

  public verDetalle(cveEstablecimiento, cveProducto, cveSucursal){
    this.navCtrl.navigateForward(['/detalle-platillo',cveEstablecimiento,cveProducto,cveSucursal]);
  }

  public revisaCarrito(cveEstablecimiento, cveSucursal){
    this.nativeStorage.getItem('carrito').
      then(data =>
      {  
        var existe = null;
        console.log(data)
        data.forEach(element => {
          if(element.id == cveEstablecimiento+'-'+cveSucursal){
            existe = element;
          }
        });
        if(existe!=null){
          var productos = existe.contenido.length;
          this.items = productos;
          console.log(productos);
        }
      },
      error => {
        console.log(error)
      }
    );
  }

}
