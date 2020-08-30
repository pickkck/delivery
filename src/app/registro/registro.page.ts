import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  myForm: FormGroup;
  nombre = '';
  telefono = '';
  email = '';
  pass1 = '';
  pass2 = '';

  
  constructor(public navCtrl: NavController, private ws: ServiceService,
    public formBuilder: FormBuilder, private nativeStorage: NativeStorage) {
    this.myForm = this.createMyForm();
  }

  ngOnInit() {
  }

  private createMyForm(){
	  return this.formBuilder.group({
      telefono: [this.telefono, Validators.required],
      nombre: [this.nombre, Validators.required],
      email: [this.email, Validators.required],
      pass2: [this.pass2, Validators.required],
	    pass1: [this.pass1, Validators.required],
	  });
  }

  registrar(){
  	console.log('submit');
  	console.log(this.myForm.value);
  	var data = JSON.stringify({
      telefono: this.myForm.value.telefono,
      nombre: this.myForm.value.nombre,
      email: this.myForm.value.email,
      pass: this.myForm.value.pass1
       });
    console.log('data para http', data);

  	this.ws.postHttp('registrar', data).then(data => {
        try{    
          console.log(data);
          if(data[0].result == "telefono duplicado"){
            this.ws.presentAlert('Error', 'Telefono Duplicado');
          }else if(data[0] != null)
          {
                //console.log('Evento')
                //this.events.publish('usuarioAlerta:login', data);

                console.log('register evento emit');
                this.ws.registerEvent.emit(data);
                

                /*console.log('guardo info en la native',data);
                this.nativeStorage.setItem('usuarioAlerta', data);
                this.router.navigateByUrl('home');*/
          }else{
            console.log('error de else login');
            this.ws.presentAlert('Error', 'Datos Invalidos');
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

  
  Inicia() {
    this.navCtrl.navigateForward('login');
  }

}
