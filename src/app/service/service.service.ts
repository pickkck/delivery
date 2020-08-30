import { Injectable, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular'; 
import { HTTP } from '@ionic-native/http/ngx';
import { Http } from '@angular/http'; 
import { map, catchError, finalize, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public http: HTTP,
  			  public alertCtrl : AlertController,
  			  public httpClient: Http) { }

  url:string="https://visor.taxisanmiguelito.com/deliveryApp/appCliente/";
  loginEvento = new EventEmitter();
  registerEvent = new EventEmitter();
  logout = new EventEmitter();
  actualizaPedidos = new EventEmitter();
  getChat = new EventEmitter();

  postHttpP(name, params){
    return new Promise( resolve => {
      this.httpClient.post(this.url+name+'.php', params).
      pipe(
        timeout(10000) //tiempo de espera
      )
      .subscribe(data => {
          try{
            console.log('Correcto')
            resolve(data.json());
          }catch(e){
            console.log('Error con e')
            resolve(e);
          }
        }, error => {
          console.log('Error con error')
          resolve(error.json());
      })
     });
  }

  postHttp(name,params){

     return new Promise( resolve => {
            this.httpClient.post(this.url+name+'.php', params)
           .subscribe(res => {
	                try{
	                    //console.log(res);
	                    resolve(res.json());
	                }catch(e){
	                    resolve(0);
	                }
	            },(error) =>{
			        //console.log('error httpClient');
			        resolve(0);
			      })
      });
  }

  async presentAlert(titulo, msj) {
    //console.log('alert');
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: msj,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }
}