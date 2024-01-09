import { AuthService } from "@services/auth/auth.service";

export class AcessoToscana {

  constructor() { }

  static verificaAcessoToscana(): boolean {
    var acesso = sessionStorage.getItem('acesso');
    return acesso == 'toscana';
  }

  static verificaHashUsuario(): boolean {
    var user = sessionStorage.getObject('user');
    var hash = user?.verificaHash;
    return hash;
  }

  static primeiroAcesso(): boolean {
    var primeiroAcesso = sessionStorage.getItem('primeiroAcesso');
    if (primeiroAcesso) {
      return primeiroAcesso === 'true';
    }
    else {
      return false;
    }
  }
}
