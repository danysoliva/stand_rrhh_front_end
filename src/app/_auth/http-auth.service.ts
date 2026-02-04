import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginDto } from '../model/login/login-dto';


@Injectable({
  providedIn:'root'
})
export class HttpAuthService {

  constructor(private httpClient: HttpClient) { }


  get(uri: string): Observable<any> {

    return this.httpClient.get(uri, this.getHeaders());
  }

  getfile(uri: string): Observable<any> {    
    return this.httpClient.get(uri, this.getHeaders());
  }


  post(uri: string, body: any): Observable<any> {
    
    return this.httpClient.post(uri, body, this.getHeaders());
  }

  put(uri: string, body: any): Observable<any> {
    return this.httpClient.put(uri, body, this.getHeaders());
  }

  delete(uri: string): Observable<any> {
    return this.httpClient.delete(uri, this.getHeaders());
  }

  private getHeaders()
  {
      let auth: LoginDto = JSON.parse(localStorage.getItem('Auth'));
      let token : string = ""
      if (auth && auth.token) {
        token = auth.token;
      }
      const header = new HttpHeaders().set('Content-Type', 'application/json').append('Authorization', 'Bearer ' + token);
        return { headers: header }
  }

  public ObtenerError(err: any) {
    console.log(err);
  }

}

export interface IHeader {
  name: "";
  value: "";
}