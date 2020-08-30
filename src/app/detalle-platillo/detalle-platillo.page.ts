import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServiceService } from '../service/service.service';
import { NavController, MenuController, LoadingController, AlertController, AngularDelegate } from '@ionic/angular';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-detalle-platillo',
  templateUrl: './detalle-platillo.page.html',
  styleUrls: ['./detalle-platillo.page.scss'],
})
export class DetallePlatilloPage implements OnInit {
cveEstablecimiento = null;
cveProducto = null;
cveSucursal = null;
platillo: any;
restaurante: any;
instrucciones: any; 
opcion: any;
opciones: any;
cantidad = 1;
precio = 0;
total = 0;
items = 0;
nota="";
check: any = new Array;
radio: any = new Array();
  constructor(public nativeStorage: NativeStorage, private activateRoute: ActivatedRoute, public navCtrl: NavController, public ws:ServiceService) { }

  ngOnInit() {
    this.cveEstablecimiento = this.activateRoute.snapshot.paramMap.get('cveEst');
    this.cveProducto = this.activateRoute.snapshot.paramMap.get('cveProd');
    this.cveSucursal = this.activateRoute.snapshot.paramMap.get('cveSuc');
    console.log(this.cveEstablecimiento);
    console.log(this.cveProducto);
    this.getInfo(this.cveEstablecimiento, this.cveProducto);
    this.getInfoSuc(this.cveEstablecimiento, this.cveSucursal);
    this.getInstrucciones(this.cveEstablecimiento, this.cveProducto);
  }

  ionViewWillEnter(){
    this.revisaCarrito(this.cveEstablecimiento, this.cveSucursal);
  }

  public getInfo(cveEst, cveProd){
    var data = JSON.stringify({
      establecimiento: cveEst,
      producto: cveProd
      });

      this.ws.postHttp('getDetallePlatillo', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              this.platillo=data;
              console.log(data)
              this.precio = data[0].costo;
              this.total = this.precio;
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

  public getInfoSuc(cveEst, cveSuc){
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

  public getInstrucciones(cveEst, cveProd){
    var data = JSON.stringify({
      establecimiento: cveEst,
      producto: cveProd
      });

      this.ws.postHttp('getInstrucciones', data).then(data => {
        try{    
          console.log(data)
          if(Array.isArray(data)){
            if(data.length>0){
              this.instrucciones = data[0];
              this.opciones = data[1];
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

  public add(){
    this.cantidad++;
    this.total = this.total + this.precio;
  }
  public remove(){
    if(this.cantidad>1){
      this.cantidad--;
      this.total = this.total - this.precio;
    }
  }

  
  public verCarrito(cveEstablecimiento, cveSucursal){
    console.log(cveEstablecimiento);
    console.log(cveSucursal)
    this.navCtrl.navigateForward(['/carrito',cveEstablecimiento,cveSucursal]);
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


  public addCarrito(){
    var radio = this.radio.filter(function (el) {
      return el != null;
    });
    var check = new Array;
    for (const key in this.check) { 
      if(this.check[key] == true){
        check.push(key);
      }
    }
    console.log(this.instrucciones);
    console.log(this.opciones);
    console.log(radio);
    console.log(check);
    var x = new Array;
    var y = 0; 
    this.instrucciones.forEach(element => {
      for (let index = 0; index < check.length; index++) {
        var algo = check[index].split("-");
        var cve1 = algo[0];
        var cve2 = algo[1];
        if(cve1==element.claveInstruccion){
          this.opciones[cve1].forEach(ele => {
            if(cve2==ele.claveOpcion){
              var ob = {
                cveInst: cve1,
                inst: element.instruccion,
                cveOpc: cve2,
                opc: ele.opcion
              }
              x.push(ob);
            }
          });
        }
      }
    });
    this.instrucciones.forEach(element => {
      for (let index = 0; index < radio.length; index++) {
        var algo = radio[index].split("-");
        var cve1 = algo[0];
        var cve2 = algo[1];
        if(cve1==element.claveInstruccion){
          this.opciones[cve1].forEach(ele => {
            if(cve2==ele.claveOpcion){
              var ob = {
                cveInst: cve1,
                inst: element.instruccion,
                cveOpc: cve2,
                opc: ele.opcion
              }
              x.push(ob);
            }
          });
        }
      }
    });
    console.log(x);
    var date = new Date();
    var agrega = {
      date: date.getTime(),
      idProducto: this.platillo[0].claveProducto,
      nota: this.nota,
      instrucciones: x,
      cantidad: this.cantidad,
      precio: this.precio,
      total: this.total,
      nombre: this.platillo[0].producto,
      descripcion: this.platillo[0].descripcion,
      foto: this.platillo[0].foto,
      totalInst: this.instrucciones
      }
    this.nativeStorage.getItem('carrito').
      then(data =>
      {  
        var inserte = false;
        data.forEach(element => {
          if(element.id == this.cveEstablecimiento+'-'+this.cveSucursal){
            if(element.claveEstado==0){
              element.contenido.push(agrega);
              inserte= true;
            }
          }
        });
        if(inserte){
          this.nativeStorage.setItem('carrito', data);
          this.navCtrl.navigateForward(['/platillos',this.cveEstablecimiento,this.cveSucursal]);
        }else{
          var obj = {
              id: this.cveEstablecimiento+'-'+this.cveSucursal,
              clavePedido: null,
              claveEstado: 0,
              estado: "Pendiente de Pago",
              contenido: [agrega]
          }
          data.push(obj);
          this.nativeStorage.setItem('carrito', data);
          this.navCtrl.navigateForward(['/platillos',this.cveEstablecimiento,this.cveSucursal]);
        }
      },
      error => {
        console.log(error)
      }
    );
  }

}
