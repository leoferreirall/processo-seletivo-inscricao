import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { HashServiceService } from '@services/HashService.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RefazerSenhaGuard implements CanActivate {

  constructor(
    private router: Router,
    private toaster: ToastrService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const hash: string = route.queryParamMap.get("hash");
    if (hash) {
      sessionStorage.setItem("hash",hash);
      return true;
    }
    else {
      this.toaster.error("Solicitação inválida");
      this.router.navigate(['/']);
      return false;
    }
  }
}
