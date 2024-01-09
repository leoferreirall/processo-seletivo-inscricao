import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.authService.getToken();
    if (token != null && this.authService.isTokenExpired()) {
      this.NgxSpinnerService.hide();
      this.NgxSpinnerService.hide('edit');
      this.NgxSpinnerService.hide('contrato');

      this.toastr.warning("Sua sessão encerrou.", "Atenção!");

      this.authService.logout();

      return throwError("Sessão encerrada!")
    } else {
      const authRquest = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });

      return next.handle(authRquest)
        .pipe(
          tap(event => {
          }, error => {
            this.NgxSpinnerService.hide();
            this.NgxSpinnerService.hide('edit');
            this.NgxSpinnerService.hide('contrato');

            this.toastr.error("Ocorreu um erro inesperado, favor tentar novamente");
          }));
    }
  }
}