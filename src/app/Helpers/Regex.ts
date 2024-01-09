export class Regex {
  static deixarApenasNumeros(numeroStr: string): string {
    if (numeroStr) {
      return numeroStr.replace(/\D+/g, '');
    }
    else {
      return '';
    }
  }
}
