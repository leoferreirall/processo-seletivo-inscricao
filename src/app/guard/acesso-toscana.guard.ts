import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcessoToscanaGuard implements CanActivate {
  constructor(
    private router: Router,
    private toaster: ToastrService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    var params = route.queryParamMap.get("t");
    var token: string = atob(route.queryParamMap.get("t"));
    var cpf: string = atob(route.queryParamMap.get("c"));
    window.history.pushState({}, document.title, "/" + this.removeURLParameter(window.location.href));

    if (params) {
      sessionStorage.setItem("token_access", token);
      sessionStorage.setItem("c", cpf);
      return true;
    }
    else {
      this.toaster.error("Solicitação inválida");
      this.router.navigate(['/']);
      return false;
    }
  }

  private removeURLParameter(url: string) {
    return url.substring(0, url.indexOf('?'));
    // const urlparts = url.split("?");
    // if (urlparts.length >= 2) {
    //   const prefix = encodeURIComponent(parameter) + "=";
    //   const pars = urlparts[1].split(/[&;]/g);

    //   for (let i = pars.length; i-- > 0; ) {
    //     if (pars[i].lastIndexOf(prefix, 0) !== -1) {
    //       pars.splice(i, 1);
    //     }
    //   }

    //   return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    // }
    // return url;
  }

}
