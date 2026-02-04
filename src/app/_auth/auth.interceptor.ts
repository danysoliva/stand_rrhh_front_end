import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UsuarioService } from '../servicio/usuario.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private user: UsuarioService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization token for full api requests
    const headers = {
      Authorization: `Bearer ${this.user.UsuarioLocalStorage.token}`
    };
    if (this.auth.isLoggedIn) {
      request = request.clone({
        setHeaders: headers,
      });
    }
    return next.handle(request);
  }
}
