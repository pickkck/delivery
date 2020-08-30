import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, Platform, ModalController, NavParams } from '@ionic/angular';
import { ServiceService } from '../service/service.service';
import L from 'leaflet';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
})
export class SeguimientoPage implements OnInit {
	map: any;
	datosPedido:any;
	markerBici:any;
	markerDestino:any;
	markerOrigen:any;
	pedido:any;
	usrEstablecimiento:any;
	interval:any;
	infoPedido: any;
	setViewOne=0;

	iconBici = L.icon({
	    iconUrl: 'assets/images/bici.png',
	    iconSize: [35, 35]
	});

	iconDestino = L.icon({
	    iconUrl: 'assets/images/destino.png',
	    iconSize: [35, 35]
	});

	iconOrigen = L.icon({
	    iconUrl: 'assets/images/origen.png',
	    iconSize: [35, 35]
	});

  constructor(public navParams: NavParams,
  			  private ws: ServiceService,
  			  private modalCtrl: ModalController,
  			  public alertCtrl : AlertController) { 

  	this.pedido = this.navParams.get('cvePedido');
  	this.usrEstablecimiento = this.navParams.get('cveEstablecimiento');

    console.log(this.pedido);
    console.log(this.usrEstablecimiento);
  	
  }

  ngOnInit() {
	this.getDatos();
  }

  ionViewDidEnter(){
  	// console.log(this.pedido);
	  this.getDatos();
	  this.getInfo();
  	this.interval = setInterval(() => {
	  this.getInfo();
	}, 10000);
  }

  ionViewWillLeave(){
  	clearInterval(this.interval);
  }

  showMapa(){
  	this.map = L.map('myMap').setView([this.infoPedido.latitudRepartidor, this.infoPedido.longitudRepartidor], 15);

  	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			   maxZoom: 19,
			   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.map);
  }

  getInfo(){
  	var data = JSON.stringify({
         claveEstablecimiento: this.usrEstablecimiento,
         clavePedido: this.pedido
       });

  	this.ws.postHttp('getSeguimientoPedido', data).then(data => {
        try{    
                // console.log('seguimiento', data);
                if (Array.isArray(data)) {
                	if (data.length > 0) {
                		this.infoPedido = data[0];
                		this.showMarker();
                	}	                	              
	            }else{
	              // this.ws.presentAlert('Error', 'No se Pedo obtener información del pedido.');
	            }
          }catch(e){   
          console.log(e);       
              this.ws.presentAlert('Error', 'Verifique su conexión a internet e intente nuevamente.');
          }
      },
        error => {
          // console.log('error post login');
          this.ws.presentAlert('Error','Error de conexión');
          this.modalCtrl.dismiss();
        });
  }

  getDatos(){
	var data = JSON.stringify({
	   establecimiento: this.usrEstablecimiento,
	   pedido: this.pedido
	 });

	this.ws.postHttp('getInfoPedido', data).then(data => {
	  try{    
			  // console.log('seguimiento', data);
			  if (Array.isArray(data)) {
				  console.log(data);
				  if (data.length > 0) {
					  this.datosPedido = data[0];
				  }	                	              
			  }else{
				// this.ws.presentAlert('Error', 'No se Pedo obtener información del pedido.');
			  }
		}catch(e){   
		console.log(e);       
			this.ws.presentAlert('Error', 'Verifique su conexión a internet e intente nuevamente.');
		}
	},
	  error => {
		// console.log('error post login');
		this.ws.presentAlert('Error','Error de conexión');
		this.modalCtrl.dismiss();
	  });
}

  showMarker(){


	console.log(this.pedido)
	console.log(this.infoPedido);

  	if (this.infoPedido.claveEstatusPedido == 4 || this.infoPedido.claveEstatusPedido == 5) {
  		if (this.setViewOne == 0) {
	  		this.showMapa();  		
	  		this.setViewOne = 1;
	  	}else{
	  		this.map.removeLayer(this.markerBici);
	  	}

	  	this.markerBici = L.marker([this.infoPedido.latitudRepartidor, this.infoPedido.longitudRepartidor],{icon: this.iconBici}).bindPopup("<b>Repartidor: </b>"+this.datosPedido.nombreRepartidor);
		this.markerBici.addTo(this.map);

		this.markerDestino = L.marker([this.infoPedido.latitudEntrega, this.infoPedido.longitudEntrega],{icon: this.iconDestino}).bindPopup("<b>Cliente: </b>"+this.datosPedido.nombreCliente+"<br/><b>Direccion: </b>"+this.datosPedido.direccionEntrega);
		this.markerDestino.addTo(this.map);

		this.markerOrigen = L.marker([this.infoPedido.latitudSucursal, this.infoPedido.longitudSucursal],{icon: this.iconOrigen}).bindPopup("<b>Restaurante: </b>"+this.datosPedido.nombreEstablecimiento+"<br/><b>Sucursal: </b>"+this.datosPedido.nombresucursal+"<br/><b>Direccion: </b>"+this.datosPedido.direccionsucursal);
		this.markerOrigen.addTo(this.map);

		
  	}else{

  		console.log('msj, sacamos de mapa y actualizamos pedidos aceptados');
  		this.ws.presentAlert('Información!', 'El pedido ya no lo tiene el repartidor.');
  		this.modalCtrl.dismiss(this.infoPedido.claveEstatusPedido);
  	}
  	
  }

}
