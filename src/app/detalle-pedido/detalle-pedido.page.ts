
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from '../service/service.service';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {
  
  cveEstablecimiento = null;
  cveSucursal = null; 
  cvePedido = null;
  restaurante: any;
  pedido: any;
  platillos: any;
  instrucciones: any;

  constructor( public alertController: AlertController, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) { }

  ngOnInit() {
    
    this.cveEstablecimiento = this.activateRoute.snapshot.paramMap.get('cveEst');
    this.cveSucursal = this.activateRoute.snapshot.paramMap.get('cveSuc');
    this.cvePedido = this.activateRoute.snapshot.paramMap.get('cvePed');
    this.getInfo(this.cveEstablecimiento, this.cveSucursal);
    this.pintaPedidos(this.cveEstablecimiento, this.cvePedido);
  }

  
  ionViewWillEnter(){
    this.pintaPedidos(this.cveEstablecimiento, this.cvePedido);
  }


  public pintaPedidos(cveEstablecimiento, cvePedido){
    var data = JSON.stringify({
      establecimiento: cveEstablecimiento,
      pedido: cvePedido
      });
    this.ws.postHttp('getPedido', data).then(data => {
      try{    
        if(Array.isArray(data)){
          if(data.length>0){
            console.log(data)
            this.pedido = data;
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

      var data = JSON.stringify({
        establecimiento: cveEstablecimiento,
        pedido: cvePedido
        });
      this.ws.postHttp('getPedidoDetalle', data).then(data => {
        try{    
          if(Array.isArray(data)){
            if(data.length>0){
              console.log(data)
              this.platillos = data;
              data.forEach(element => {


                var datos = JSON.stringify({
                  establecimiento: cveEstablecimiento,
                  pedido: cvePedido,
                  producto: element.claveProducto
                  });
            
                  this.ws.postHttp('getInstruccionesPedido', datos).then(data => {
                    try{    
                      if(Array.isArray(data)){
                        console.log(data)
                        if(data.length>0){
                          console.log(data)
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


}
