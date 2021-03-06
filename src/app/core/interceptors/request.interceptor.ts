import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from '@env/environment';
import { HEADER_NEED_CREDENTIALS } from '../data-services';

const HTTP_PATTERN = new RegExp('^(?:[a-z]+:)?//', 'i');
const DIALOG_URL = `${environment.dialogUrl}/b2capi/mobileapps/${environment.apiVersion}/`;
const API_URL = `${environment.apiUrl}/`;
@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private context: { [name: string]: string } = {
    'language': 'en',
    'UTC-offset': moment().format('Z'),
    'platform': 'consumer-portal',
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!HTTP_PATTERN.test(req.url)) {
      let url = '';
      if (req.url.includes('catalogue')) {
        url = DIALOG_URL + req.url;
      } else {
        url = API_URL + req.url;
      }
      const setHeaders: { [name: string]: any } = {
        'Context': JSON.stringify(this.context)
      };

      req = req.clone({ url, setHeaders, headers: req.headers.delete(HEADER_NEED_CREDENTIALS) });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 503) {
          document.body.innerHTML = error.error['html_content'];
        }
        return throwError(error.error);
      })
    );
  }
}

