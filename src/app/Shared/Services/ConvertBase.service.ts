import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertBaseService {

constructor() { }


convertBase64ToFile(base64String, fileName) {
  let arr = base64String.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let uint8Array = new Uint8Array(n);
  while (n--) {
    uint8Array[n] = bstr.charCodeAt(n);
  }
  let file = new File([uint8Array], fileName, { type: mime });
  return file;
}

}
