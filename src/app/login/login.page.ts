import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	myForm: FormGroup;
	usuario = '';
	pass = '';

  constructor(public navCtrl: NavController, private ws: ServiceService,
  			  public formBuilder: FormBuilder,private nativeStorage: NativeStorage) {
  	this.myForm = this.createMyForm();
  }

  ngOnInit() {
  }

  private createMyForm(){
	  return this.formBuilder.group({
      	usuario: [this.usuario, Validators.required],
	    pass: [this.pass, Validators.required],
	  });
  }
  

  iniciarSesion(){
  	console.log('submit');
  	console.log(this.myForm.value);
  	var data = JSON.stringify({
         usuario: this.myForm.value.usuario,
         pass: this.myForm.value.pass
       });
    console.log('data para http', data);

  	this.ws.postHttp('login', data).then(data => {
        try{    
              console.log(data);
              if(data[0].claveCliente != null)
              {
                    //console.log('Evento')
                    //this.events.publish('usuarioAlerta:login', data);

                    console.log('login evento emit');
                    this.ws.loginEvento.emit(data);
                    

                    /*console.log('guardo info en la native',data);
                    this.nativeStorage.setItem('usuarioAlerta', data);
                    this.router.navigateByUrl('home');*/
              }else{
                console.log('error de else login');
                  this.ws.presentAlert('Error', 'Datos Invalidos');
                  this.nativeStorage.clear();
              }
              
          }catch(e){           
            this.ws.presentAlert('Error', 'Datos Invalidos');
            this.nativeStorage.clear();
          }
      },
        error => {
          console.log('error post login');
          this.ws.presentAlert('Error','Error de conexión');
        });
  }

  
  Register() {
    this.navCtrl.navigateForward('registro');
  }

}
