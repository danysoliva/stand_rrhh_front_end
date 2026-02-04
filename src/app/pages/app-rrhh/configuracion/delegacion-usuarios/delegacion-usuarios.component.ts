import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CambiarPinDto } from '../../../../model/maestro/cambiar-pin-dto';
import { RolUsuarioDto } from '../../../../model/maestro/rol-usuario-dto';
import { RolUsuarioParamsDto } from '../../../../model/maestro/rol-usuario-params-dto';
import { MaestroService } from '../../../../servicio/maestro.service';
import { Alerts } from '../../../../_common/utils/alerts';
import * as $ from 'jquery';
import { DxNumberBoxComponent } from 'devextreme-angular';
import { log } from 'console';

@Component({
  selector: 'ngx-delegacion-usuarios',
  templateUrl: './delegacion-usuarios.component.html',
  styleUrls: ['./delegacion-usuarios.component.scss']
})
export class DelegacionUsuariosComponent implements OnInit {

  fcPIN = new UntypedFormControl(null, Validators.required);
  fcConfirmarPIN = new UntypedFormControl(null, Validators.required);
  pinValido: boolean = null;
  pinConfirmado: boolean = null;
  popupCambiarPinVisible: boolean = false;
  pinNoEsNumero: boolean;
  pinMenorACuatro: boolean;
  pinTresDigitosConsecutivos: boolean;
  pinTresIgualesConsecutivos: boolean;
  pinNoCoincide: boolean;

  keyUpPIN(e) {
    const inputValue = e.event.target.value;
    this.pinValido = this.esPinValido(inputValue, false);
    if (this.fcConfirmarPIN.value != null)
      this.pinConfirmado = this.esPinConfirmado(inputValue, this.fcConfirmarPIN.value, false);
  }

  keyUpConfirmarPIN(e) {
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

  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  constructor(private maestroService: MaestroService) { }

  roles: RolUsuarioDto[];
  nivelUsuario = [{ id: 2, descripcion: "Administrator" }, { id: 1, descripcion: "Usuario" }, { id: 2, descripcion: "Administrador" }]
  mensajeUsuario = [{ id: 1, mensaje: "¿Desea convertir este usuario en administrador?" }, { id: 2, mensaje: "¿Desea quitar permisos de administrador a este usuario?" }]
  popupVisible: boolean=false;
  mensaje: string;
  rolUsuarioParam: RolUsuarioParamsDto;


  ngOnInit(): void {
    this.maestroService.obtenerRoles().then(data => {
      this.roles = data;
    });
  }

  cambiarPinDto: CambiarPinDto = new CambiarPinDto();

  cambiarPin(e) {

    // console.log(this.popupCambiarPinVisible);
    
    this.cambiarPinDto.employeeId = e.employeeId;
    this.pinConfirmado = null;
    this.pinValido = null;
    this.fcPIN.reset();
    this.fcConfirmarPIN.reset();
    this.popupCambiarPinVisible = true; 
  }

  guardarPIN() {
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
      this.cambiarPinDto.nuevoPin = this.fcPIN.value;
      this.maestroService.cambiarPinDeEmpleado(this.cambiarPinDto)
        .then(() => {
          Alerts.success('¡Exito!', 'El pin se cambió correctamente');
          this.fcPIN.reset();
          this.popupCambiarPinVisible = false;
        });
    }
  }

  cancelarCambioPin() {
    this.popupCambiarPinVisible = false;
  }

  userLevelId: number;

  editar(data) {

    // console.log(data);
    
    this.userLevelId = this.nivelUsuario.find(d => d.descripcion === data.nivelUsuario).id;

    this.mensaje = this.mensajeUsuario.find(f => f.id === this.userLevelId).mensaje;

    this.rolUsuarioParam = new RolUsuarioParamsDto;

    this.rolUsuarioParam.employeeId = data.employeeId;
    this.rolUsuarioParam.userLevelId = this.userLevelId;
    this.abrirPopup();
  
  }

  async confirmar() {
    // console.log(this.userLevelId);
    this.maestroService.cambiarRolUsuario(this.rolUsuarioParam).then(data => {
      Swal.fire(
        '',
        'Se han cambiado los permisos',
        'success'
      )



      this.cerrarPopup();

      this.roles = [];

      this.maestroService.obtenerRoles().then(data => {
        this.roles = data;
      })

    }).catch(mensaje => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
      })

      this.cerrarPopup();

    })
  }

  cancelar() {
    this.cerrarPopup();
  }

  sonConsecutivosEIguales(arr: number[]) {
    const prev = {
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

  sonConsecutivos(arr, n) {
    // arr.sort();
    for (var i = 1; i < n; i++)
      if (arr[i] != arr[i - 1] + 1)
        return false;

    return true;
  }

  // @ViewChild("pin", { static: false }) pin: DxNumberBoxComponent;

  // this.inputNuevoPin = e.component;
  onInitialized(e){
    
    $(e.element).find("input").attr("autocomplete", "on");
  }

}
