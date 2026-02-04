import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CredencialUsuarioDto } from '../model/login/credencial-usuario-dto';
import { LoginDto } from '../model/login/login-dto';


@Injectable()
export class UsuarioService {

  constructor(private httpClient: HttpClient) {
  }

  public get UsuarioLocalStorage(): LoginDto {
    let usuario = localStorage.getItem("Auth");
    
    if (usuario == null || usuario == "") {
      return new LoginDto;
    }
    
    const usuarioDevolver: LoginDto = JSON.parse(usuario) as LoginDto;
    return usuarioDevolver;
  }

  login(credenciales:CredencialUsuarioDto): Promise<LoginDto>
  {
    let promesa = new Promise<LoginDto>((resolve, reject) => {
      let uri = `${environment.rrhh_api}login`
      this.httpClient.post<LoginDto>(uri, credenciales)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    })

    return promesa;
  }

}
