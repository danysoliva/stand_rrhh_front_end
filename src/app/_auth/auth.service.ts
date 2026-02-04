import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CredencialUsuarioDto } from '../model/login/credencial-usuario-dto';
import { LoginDto } from '../model/login/login-dto';
import { UsuarioService } from '../servicio/usuario.service';
import { Alerts } from '../_common/utils/alerts';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    loginModel: LoginDto;

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
    ) {
    }

    isLoggedIn() {
        return this.loggedIn.value;
    }

    login(credencial: CredencialUsuarioDto) {
        Alerts.openLoad();

        this.usuarioService.login(credencial)
            .then((data) => {
                this.loginModel = data
                localStorage.setItem("Auth", JSON.stringify(this.loginModel));
                this.loggedIn.next(true);

                // Alerts.success('','¡Bienvenido(a)!');
                Alerts.closeLoad();
                this.router.navigate(['/pages/home']);
            }).catch(() => this.loggedIn.next(false));
    }

    logout() {
        this.loggedIn.next(false);
        localStorage.clear();

        let esLoginPage: boolean = this.router.url === '/auth/login'
        if (!esLoginPage)
            this.router.navigate(['/auth/login']);
    }

    verificarToken() {
        if (this.usuarioService.UsuarioLocalStorage.token == undefined) {
            this.router.navigate(['/auth/login']);
        }
    }
}