import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.page.html',
  styleUrls: ['./restaurantes.page.scss'],
})
export class RestaurantesPage implements OnInit {
  lat:number;
  lon:number;
  restaurantes:any;
  resultado:any;
  interval:any;
  costos: any = new Array;
  buscar: any = "";
  busqueda: boolean = false;
  noResul = false;
  constructor(public navCtrl: NavController, public geolocation:Geolocation, public ws:ServiceService) { 
    this.getRestaurantes()
  }

  ngOnInit() {
  }


  public borraBusqueda(){
    this.buscar="";
    this.busqueda=false;
    this.noResul=false;
  }
  getRestaurantes(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
    });
    var data = JSON.stringify({
                    latitude: this.lat,
                    longitude: this.lon
                    });
       
    this.ws.postHttp('getNegocios', data).then(data => {
      try{    
        console.log(data)
        if(Array.isArray(data)){
          if(data.length>0){
            this.restaurantes=data;
            data.forEach(element => {
              this.getEnvio(element.claveEstablecimiento, element.claveSucursal);
            });
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

  public pulsar(e){
    console.log(e)
    if(e.charCode==13){
      var data = JSON.stringify({
        lat: this.lat,
        lon: this.lon,
        busqueda: this.buscar
        });
        console.log(data)
        this.ws.postHttp('getBusqueda', data).then(data => {
          try{    
            if(Array.isArray(data)){
              if(data.length>0){
                console.log(data)
                this.resultado = data;
                this.busqueda=true;
              }else{
                this.noResul = true;
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
        }else{
        }
  }

  public onCancel(event){
    console.log("cancel");
  }

  public getEnvio(cveEstablecimiento, cveSucursal){
    var data = JSON.stringify({
      establecimiento: cveEstablecimiento,
      sucursal: cveSucursal,
      lat: this.lat,
      lon: this.lon
      });
      console.log(data);
      this.ws.postHttp('getCostoEnvio', data).then(data => {
        try{    
          if(Array.isArray(data)){
            console.log(data)
            if(data.length>0){
              if(data[1].costo!="error"){
                this.costos.push(data[1].costo);
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

  public verPlatillos(cveEstablecimiento, cveSucursal){
    console.log("Establecimiento"+cveEstablecimiento);
    console.log("Sucursal"+cveSucursal);
    this.navCtrl.navigateForward(['/platillos',cveEstablecimiento,cveSucursal]);
  }

  public verDetalle(cveEstablecimiento, cveProducto, cveSucursal){
    this.navCtrl.navigateForward(['/detalle-platillo',cveEstablecimiento,cveProducto,cveSucursal]);
  }

}
