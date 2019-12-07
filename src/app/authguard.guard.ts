import { ApiServiceServiceService } from '@app/api-service-service.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  constructor(private service : ApiServiceServiceService){}
  canActivate(){
    if (this.service.login()) {
      return true;
      }
      else {
      return false;
      }
  }
  
  
}
