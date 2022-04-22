import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Injectable } from "@angular/core";


@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private router: Router,
        private toastr: ToastrService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => { },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {

                    }
                }
            )
        );
    }
}