import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, min, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoginDto } from '../../../model/login/login-dto';
import { Router } from '@angular/router';
import { AbstractControl, UntypedFormControl, Validators } from '@angular/forms';
import { Alerts } from '../../../_common/utils/alerts';
import { MaestroService } from '../../../servicio/maestro.service';
import * as $ from 'jquery';
import { DxNumberBoxComponent } from 'devextreme-angular';
import { CambiarPinDto } from '../../../model/maestro/cambiar-pin-dto';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  // @ViewChild("pinConfirmacion", { static: false }) pinConfirmacion: DxNumberBoxComponent;

  // inputNuevoPin: any;
  // getInstanceNuevoPin(e) {
  //   this.inputNuevoPin = e.component;
  // }

  fcPIN = new UntypedFormControl(null, Validators.required);
  fcConfirmarPIN = new UntypedFormControl(null, Validators.required);
  pinValido: boolean = false;
  pinConfirmado: boolean = false;
  popupVisible: boolean = false;
  pinNoEsNumero: boolean = false;
  pinMenorACuatro: boolean = false;
  pinTresDigitosConsecutivos: boolean = false;
  pinTresIgualesConsecutivos: boolean = false;
  pinNoCoincide: boolean = false;

  keyUpPIN(e: any) {
    const inputValue = e.event.target.value;
    this.pinValido = this.esPinValido(inputValue, false);
    if (this.fcConfirmarPIN.value != null)
      this.pinConfirmado = this.esPinConfirmado(inputValue, this.fcConfirmarPIN.value, false);
  }

  keyUpConfirmarPIN(e: any) {
    const inputValue = e.event.target.value;
    this.pinConfirmado = this.esPinConfirmado(this.fcPIN.value, inputValue, false);
  }

  esPinValido(pin: any, showAlert: boolean = true): boolean {
    this.pinNoEsNumero = false;
    this.pinMenorACuatro = false;
    this.pinTresDigitosConsecutivos = false;
    this.pinTresIgualesConsecutivos = false;

    const esUnNumero = !isNaN(pin);
    const tieneEspacios = pin.includes(" ");
    const tienePunto = pin.includes(".");
    if (esUnNumero == false || tieneEspacios || tienePunto) {
      this.pinNoEsNumero = true;      
      if (showAlert) {
        Alerts.warning('¡Atención!', 'El pin debe contener sólo números');
      }
      return false;
    }

    const arregloNumeros = Array.from(String(pin), Number);
    if (arregloNumeros.length < 4) {
      this.pinMenorACuatro = true;
      if (showAlert) {
        Alerts.warning('¡Atención!', 'El pin debe tener por lo menos 4 dígitos');
      }
      return false;
    }

    let arregloCompletoEsConsecutivo = this.sonConsecutivos(arregloNumeros.slice(1), arregloNumeros.length)
    let arregloPrimerosTresEsConsecutivo = this.sonConsecutivos(arregloNumeros.slice(0, 3), 3)
    let arregloUltimosTresEsConsecutivo = this.sonConsecutivos(arregloNumeros.slice(-3), 3)
    if (arregloCompletoEsConsecutivo || arregloPrimerosTresEsConsecutivo || arregloUltimosTresEsConsecutivo) {
      this.pinTresDigitosConsecutivos = true;
      if (showAlert) {
        Alerts.warning('¡Atención!', 'El pin no puede contener 3 dígitos consecutivos');
      }
      return false;
    }

    let arregloNumerosRepetidos = this.sonConsecutivosEIguales(arregloNumeros);
    if (arregloNumerosRepetidos) {
      this.pinTresIgualesConsecutivos = true;
      if (showAlert) {
        Alerts.warning('¡Atención!', 'El pin no puede contener 3 dígitos iguales de forma consecutiva');
      }
      return false;
    }

    return true;
  }

  esPinConfirmado(pin: any, pinConfirmacion: any, showAlert: boolean = true): boolean {
    this.pinNoCoincide = false;

    if (pin != pinConfirmacion) {
      this.pinNoCoincide = true;
      if (showAlert) {
        Alerts.warning('¡Atención!', 'El pin no coinciden');
      }
      return false;
    }

    return true;
  }

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  datosUsuario: LoginDto = new LoginDto();
  nombre: string="";

  
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  // userMenu = [];
  userMenu: { title: string; icon: string }[] = [];

  tag = 'my-context-menu';

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private maestroService: MaestroService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.datosUsuario = JSON.parse(localStorage.getItem('Auth' ) || '{}') as LoginDto;

    if (this.datosUsuario == undefined) {
      this.router.navigate(['/auth']);
    }

    this.nombre = this.datosUsuario.name;
    
    this.userMenu.push({ title: this.nombre.toUpperCase(), icon: '' }, { title: 'Cambiar pin', icon: 'shield' }, { title: 'Log out', icon: 'log-out-outline' });


    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()

      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log out') {
        // console.log('logout clicked');
        this.router.navigate(['/auth']);
      }

      if (event.item.title === 'Cambiar pin') {
        this.pinMenorACuatro = false;
        this.pinTresDigitosConsecutivos = false;
        this.pinTresIgualesConsecutivos = false;
        this.pinNoCoincide = false;
        this.pinConfirmado = false;
        this.pinValido = false;
        this.fcPIN.reset();
        this.fcConfirmarPIN.reset();
        this.popupVisible = true;
      }

    });
  }

  cambiarPIN() {
    Alerts.openLoad();

    this.pinValido = this.esPinValido(this.fcPIN.value);
    if (!this.pinValido) {
      return;
    }

    this.pinConfirmado = this.esPinConfirmado(this.fcPIN.value, this.fcConfirmarPIN.value);
    if (!this.pinValido) {
      return;
    }

    if (this.pinValido && this.pinConfirmado) {
      const cambiarPinDto = new CambiarPinDto()
      cambiarPinDto.nuevoPin = this.fcPIN.value;
      this.maestroService.cambiarPIN(cambiarPinDto)
        .then(() => {
          Alerts.success('¡Exito!', 'El pin se cambió correctamente');
          this.fcPIN.reset();
          this.popupVisible = false;
        });
    }
  }

  cancelar() {
    this.popupVisible = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  sonConsecutivosEIguales(arr: number[]) {
  const prev: { element: number | null, count: number } = {
    element: null,
    count: 0
  };
  
    for (let i = 0; i < arr.length; i++) {
      const { count, element } = prev;
      if (count === 1 && element === arr[i]) {
        return true;
      };
      prev.count = element === arr[i] ? count + 1 : count;
      prev.element = arr[i];
    };
    return false;
  };

  sonConsecutivos(arr: number[], n: number) {
    // arr.sort();
    for (var i = 1; i < n; i++)
      if (arr[i] != arr[i - 1] + 1)
        return false;

    return true;
  }
}
