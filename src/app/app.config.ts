import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable()
export class AppConfig {
    static settings: any;
    constructor(private http: HttpClient) { }
    load() {
        const jsonFile = `assets/config/config.${environment.production ? 'prod' : 'dev'}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: any) => {
                AppConfig.settings = response;
                
                resolve();
            }).catch((response: any) => {                
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}