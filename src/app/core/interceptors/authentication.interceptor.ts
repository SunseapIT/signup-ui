import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// add authorization header with jwt token if available
const localStorageVariable = localStorage.getItem('Authorization');
if (localStorageVariable && request.url.includes(environment.baseUrl)) {
request = request.clone({
setHeaders:{
  'Authorization': localStorageVariable
}
});
}

return next.handle(request);
}
}
