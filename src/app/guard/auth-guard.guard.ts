import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ServiceService } from '../service/service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(public nativeStorage: NativeStorage, 
  			      private router: Router,
              private ws: ServiceService){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.nativeStorage.getItem('usuario').then(data => { 
      return true;
    },
    error => {
	    //console.log('NO GUARD PAGINAS'+ error);
	    this.router.navigateByUrl('login');
	    return false;
    } );

  }
  
}