import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ServiceService } from '../service/service.service';

@Injectable({
  providedIn: 'root'
})
export class LogGuardGuard implements CanActivate {
  constructor(public nativeStorage: NativeStorage, 
  	          private router: Router,
              private ws: ServiceService){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.nativeStorage.getItem('usuario').then(data => { 
      this.router.navigateByUrl('/tabs/tabs/tab2');
      return false;
    },
    error => {
    	//console.log('PERMITIMOS GUARD LOGIN');
  		return true;
    } );

  }
  
}