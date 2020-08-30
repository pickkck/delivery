import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from '../service/service.service';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  lat:number;
  lon:number;
  cveEstablecimiento = null;
  cveSucursal = null; 
  restaurante: any;
  platillos: any;
  instrucciones: any;
  totalInst: any;
  total: any = 0;
  cupon: any;
  totalFinal: any = 0;
  usuario: any;
  clavePedido: any = null;
  direccion: any;
  envio: any;
  costo: any = 0;
  descuento: any;
  descuentoNum: any = "0";
  cuponAplicado: any = "";

  constructor(private payPal: PayPal, public geolocation:Geolocation, public alertController: AlertController, public nativeStorage: NativeStorage, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) { }

  ngOnInit() {
    
    this.cveEstablecimiento = this.activateRoute.snapshot.paramMap.get('cveEst');
    this.cveSucursal = this.activateRoute.snapshot.paramMap.get('cveSuc');
    console.log(this.cveSucursal);
    console.log(this.cveEstablecimiento);
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      console.log(this.lat+" , "+this.lon)
      this.getEnvio();
    });
    this.getInfo(this.cveEstablecimiento, this.cveSucursal);
  }

  
  ionViewWillEnter(){
    this.pintaPedidos(this.cveEstablecimiento, this.cveSucursal);
  }

  public getEnvio(){
    var data = JSON.stringify({
      establecimiento: this.cveEstablecimiento,
      sucursal: this.cveSucursal,
      lat: this.lat,
      lon: this.lon
      });
      console.log(data);
      this.ws.postHttp('getCostoEnvio', data).then(data => {
        try{    
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              if(data[1].costo!="error"){
                this.totalFinal = this.totalFinal+data[1].costo;
                this.costo = data[1].costo;
              }else{
                this.totalFinal= "Error";
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


  public pintaPedidos(cveEstablecimiento, cveSucursal){
    this.totalFinal=0;
    this.nativeStorage.getItem('carrito').
    then(data =>
    {
      data.forEach(element => {
        if(element.id == cveEstablecimiento+'-'+cveSucursal){
            this.platillos = element.contenido;
          console.log(this.platillos)
        }
      });
      this.total=0;
      this.platillos.forEach(element => {
        this.total = this.total + element.total;
      });
      this.totalFinal= this.total;
    },
    error => {
      console.log(error)
    }
  );
  }


  public verPedidos(){
    this.navCtrl.navigateForward(['/tabs/tabs/tab2']);
  }

  public getInfo(cveEst, cveSuc){
    this.nativeStorage.getItem('usuario').
    then(data =>
    {
      this.usuario = data;
    },
    error => {
      console.log(error)
    }
  );
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

  public verCupon(){
    var data = JSON.stringify({
      codigo: this.cupon,
      cliente: this.usuario.claveCliente,
      establecimiento: this.cveEstablecimiento,
      sucursal: this.cveSucursal,
      monto: this.total
      });

      this.ws.postHttp('getCupon', data).then(data => {
        try{    
          if(Array.isArray(data)){
            if(data.length>0){
              if(data[0].result=="error"){
                this.ws.presentAlert('Error','Cupón invalido, revisa cupón o terminos y condiciones.');
                this.cupon="";
              }else{
                if(data[0].tipoCodigo==2){
                  if(this.cuponAplicado==""){
                    this.ws.presentAlert('Felicidades','Cupón aplicado correctamente.');
                    this.descuento = "-$"+data[0].descuentoCantidad;
                    this.totalFinal = this.totalFinal-data[0].descuentoCantidad;
                    this.cuponAplicado = this.cupon;
                    this.descuentoNum = data[0].descuentoCantidad;
                    this.cupon="";
                  }else{
                    this.ws.presentAlert('Error','Ya has aplicado un cupón de descuento.');
                  }
                }else{
                  if(this.cuponAplicado==""){
                    this.ws.presentAlert('Felicidades','Cupón aplicado correctamente.');
                    this.descuento = data[0].descuentoPorcentaje+"%";
                    this.totalFinal = this.totalFinal-(this.total*(data[0].descuentoPorcentaje/100));
                    this.cuponAplicado = this.cupon;
                    this.descuentoNum = this.total*(data[0].descuentoPorcentaje/100);
                    this.cupon="";
                  }else{
                    this.ws.presentAlert('Error','Ya has aplicado un cupón de descuento.');
                  }
                }
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

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirma tu Pedido!',
      message: 'Selecciona metodo de pago!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Pagar',
          handler: () => {
            // this.payPal.init({
            //   PayPalEnvironmentProduction: 'Adpzhf1URcfBlrHn7E15FA_2Z-JlSTSm1KpqRwrFzjOKWJ2-9xtrDyNqFqgp6uBvbw1ICUHmQpkSn7Re',
            //   PayPalEnvironmentSandbox: 'sb-zdoqz1795768@business.example.com'
            // }).then(() => {
            //   // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            //   this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            //     // Only needed if you get an "Internal Service Error" after PayPal login!
            //     //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            //   })).then(() => {
            //     let payment = new PayPalPayment('3.33', 'MXN', 'Description', 'Consumo Delivery');
            //     this.payPal.renderSinglePaymentUI(payment).then((data) => {
            //       // Successfully paid
            //       console.log(data)
            
            //       // Example sandbox response
            //       //
            //       // {
            //       //   "client": {
            //       //     "environment": "sandbox",
            //       //     "product_name": "PayPal iOS SDK",
            //       //     "paypal_sdk_version": "2.16.0",
            //       //     "platform": "iOS"
            //       //   },
            //       //   "response_type": "payment",
            //       //   "response": {
            //       //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //       //     "state": "approved",
            //       //     "create_time": "2016-10-03T13:33:33Z",
            //       //     "intent": "sale"
            //       //   }
            //       // }
            //     }, (data) => {
            //       console.log(data)
            //       // Error or render dialog closed without being successful
            //     });
            //   }, (data) => {
            //     console.log(data)
            //     // Error in configuration
            //   });
            // }, (data) => {
            //   console.log(data)
            //   // Error in initialization, maybe PayPal isn't supported or something else
            // });
            this.cargarPedido();
          }
        }
      ]
    });

    await alert.present();
  }

  public confirmar(){
    this.presentAlertConfirm();
  }

  public cargarPedido(){
    var detalle = false;
    var instrucciones = false;
    var data = JSON.stringify({
            cveEstablecimiento: this.cveEstablecimiento,
            cveCliente: this.usuario.claveCliente,
            cveSucursal: this.cveSucursal,
            descuento: this.descuentoNum,
            direccionEntrega: this.direccion,
            latitudEntrega: this.lat,
            longitudEntrega: this.lon,
            costoEnvio: this.costo,
            total: this.total,
            codigoDescuento: this.cuponAplicado
      });
      console.log(data)
      this.ws.postHttp('insertPedido', data).then(data => {
        try{    
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              this.platillos.forEach(element => {


                var datos = JSON.stringify({
                          cveEstablecimiento: this.cveEstablecimiento,
                          cvePedido: data[0].result,
                          cveProducto: element.idProducto,
                          instruccionesEspeciales: element.nota,
                          cantidad: element.cantidad
                    });
                    this.clavePedido = data[0].result;
                    this.actualizaDatos();
                    this.ws.postHttp('insertDetallePedido', datos).then(data => {
                      try{    
                        console.log(data)
                        if(Array.isArray(data)){
                          if(data.length>0){
                            console.log('cvePedido')
                            console.log(data)
                            detalle = true;
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

                      element.instrucciones.forEach(ele => {

                        var datos = JSON.stringify({
                                cveEstablecimiento: this.cveEstablecimiento,
                                cvePedido: data[0].result,
                                cveProducto: element.idProducto,
                                cveInstruccion: ele.cveInst,
                                cveOpcion: ele.cveOpc
                          });
                          console.log(datos)
                          this.ws.postHttp('insertInstrucciones', datos).then(data => {
                            try{    
                              if(Array.isArray(data)){
                                if(data.length>0){
                                  console.log(data)
                                  instrucciones = true;
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
                        
                      });

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
        this.eliminaPedido();
        this.navCtrl.navigateForward(['/tabs/tabs/tab1']);

  }

  public eliminaPedido(){
    var temp = new Array;
    this.nativeStorage.getItem('carrito').
    then(data =>
    {
      data.forEach(element => {
        if(element.id != this.cveEstablecimiento+'-'+this.cveSucursal){
          temp.push(element);
        }
      });
      this.nativeStorage.setItem('carrito', temp);
    },
    error => {
      console.log(error)
    }
  );

  }

  public actualizaDatos(){
    var data = JSON.stringify({
      establecimiento: this.cveEstablecimiento,
      pedido: this.clavePedido
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
                    if(element.id == this.cveEstablecimiento+'-'+this.cveSucursal){
                      element.clavePedido = this.clavePedido;
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


  public eliminar(date){
    var temp = new Array;
    this.platillos.forEach(element => {
      if(element.date != date){
        temp.push(element);
      }
    });

    this.nativeStorage.getItem('carrito').
    then(data =>
    {
      data.forEach(element => {
        if(element.id == this.cveEstablecimiento+'-'+this.cveSucursal){
          element.contenido = temp;
        }
      });
      this.nativeStorage.setItem('carrito', data);
      this.pintaPedidos(this.cveEstablecimiento, this.cveSucursal);
    },
    error => {
      console.log(error)
    }
  );

  }

}
