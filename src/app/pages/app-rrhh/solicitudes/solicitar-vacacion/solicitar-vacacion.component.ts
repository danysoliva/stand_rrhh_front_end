import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NuevaSolicitudVacacionDto, SolicitudVacacionDto } from '../../../../model/solicitud/solicitud-vacacion-dto';
import { TipoVerificacionEnum, ValidarVacacionDto } from '../../../../model/solicitud/validar-vacacion-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { EstadoSolicitudEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { TipoVacacionDto } from '../../../../model/solicitud/tipo-vacacion-dto';

export enum Jornada {
  Ocultar = 0,
  Mañana = 1,
  Tarde = 2
}

@Component({
  selector: 'ngx-solicitar-vacacion',
  templateUrl: './solicitar-vacacion.component.html',
  styleUrls: ['./solicitar-vacacion.component.scss']
})
export class SolicitarVacacionComponent implements OnInit {

  // jornadas: string[];
  jornadas = [
    { id: 1, nombre: 'Mañana' },
    { id: 2, nombre: 'Tarde' }
  ];

  cantidadDiasPendientes: number;
  estadoSolicitudEnum = EstadoSolicitudEnum;
  solicitudIdSeleccionada:number;
  popupVisible: boolean = false;
  popupConfirmarEliminacionVisible: boolean = false;
  abrirPopup = () => { this.popupVisible = true; }
  cerrarPopup = () => { this.popupVisible = false; };
  abrirPopupConfirmarEliminacion = (solicitudId: number) => { this.popupConfirmarEliminacionVisible = true; this.solicitudIdSeleccionada = solicitudId; };
  cerrarPopupConfirmarEliminacion = () => { this.popupConfirmarEliminacionVisible = false };
  validarVacacion: ValidarVacacionDto = new ValidarVacacionDto();
  nuevaSolicitudDeVacacion: NuevaSolicitudVacacionDto = new NuevaSolicitudVacacionDto();
  solicitudesDeVacacion: Array<SolicitudVacacionDto> = new Array<SolicitudVacacionDto>();
  tipoDeVacaciones: Array<TipoVacacionDto> = new Array<TipoVacacionDto>();
  startDate: Date = new Date();
  endDate: Date = new Date();

  vacacionForm = this.fb.group({
    fechaInicio: [new Date().toISOString(), Validators.required],
    fechaFin: [new Date().toISOString(), Validators.required],
    fechaReintegro: [new Date().toISOString(), Validators.required],
    cantidadDiasVacacion: [0, [Validators.required, Validators.min(0.5)]],
    jornada: [0],
    cubreVacaciones: ['', Validators.required],
    observaciones: [''],
    tipoVacacion: [1,Validators.required],
    actividadesPendientes: ['']
  });
  today = new Date().toISOString();
  constructor(private fb: UntypedFormBuilder, private solicitudService: SolicitudService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    // this.jornadas = this.jornadaEntidad.map(j => j.nombre);

    this.solicitudService.obtenerSolicitudesDeVacacionesPorEmpleadoId()
      .then((data) => {
        this.solicitudesDeVacacion = data;
      })

      this.solicitudService.ObtenerTipoVacaciones()
      .then((data)=>{
        this.tipoDeVacaciones=data;
        
        // console.log(data);
      });

      
  }

  async solicitarVacacion() {    
    this.jornadaVisible = false;
    this.vacacionForm.controls.cantidadDiasVacacion.setValue(0);
    this.vacacionForm.controls.jornada.setValue(0);
    this.vacacionForm.controls.cubreVacaciones.setValue('');
    this.vacacionForm.controls.observaciones.setValue('');
    this.vacacionForm.controls.fechaInicio.setValue(this.today);
    this.vacacionForm.controls.fechaFin.setValue(this.today);
    this.vacacionForm.controls.fechaReintegro.setValue(this.today);
    this.vacacionForm.controls.tipoVacacion.setValue(0);

    this.cantidadDiasPendientes = await this.solicitudService.obtenerDiasPendientesDeVacacion();    
    this.abrirPopup();
  }

  fechaInicioChanged(e) {
    // Alerts.openLoad('');
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');

    if (this.validarVacacion.fechaInicio > this.validarVacacion.fechaFin) {
      this.vacacionForm.patchValue({
        fechaFin: this.validarVacacion.fechaInicio 
      });
      return;
    }

    if (this.enProceso) return;
    this.enProceso = true;

    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd');
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorFecha;
    
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
      .then((data) => {
        this.validarVacacion = data;

        this.vacacionForm.patchValue({
          fechaFin: this.validarVacacion.fechaFin,
          fechaReintegro: this.validarVacacion.fechaReintegro,
          cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion
        });

        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion').setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  fechaFinChanged(e) {
    // Alerts.openLoad('');
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');

    if (this.validarVacacion.fechaFin < this.validarVacacion.fechaInicio) {
      this.vacacionForm.patchValue({
        fechaInicio: this.validarVacacion.fechaFin,
        jornada: this.validarVacacion.jornada
      });
      return;
    }

    if (this.enProceso) return;
    this.enProceso = true;

    
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd');
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorFecha;
    
    
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
    .then((data) => {
   
      this.validarVacacion = data;
      
      this.vacacionForm.patchValue({          
        fechaFin: this.validarVacacion.fechaFin,
        fechaReintegro: this.validarVacacion.fechaReintegro,
        cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,
        jornada: this.validarVacacion.jornada
      });

      
        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion').setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  cantidadDiasVacacionOnContentReady(e){
    console.log(e);
    let inp = e.element.querySelector(".dx-texteditor-input");  
    console.log(inp);
    
    if (inp) {  
      inp.addEventListener('focus', function() {  
        inp.select();  
      });  
    }  
  }

  enProceso: boolean;
  contador: number;
  jornadaVisible: boolean = false;
  cantidadDiasVacacionChanged(e) {
 
      if (e.value < 0 || this.enProceso) return;
      this.enProceso = true;      
      
      this.contador = 1;
      this.validarVacacion = this.vacacionForm.getRawValue();
      this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
      this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');
      this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd');
      this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorDias;

      console.log('validarVacacionC',this.validarVacacion);
      
      this.solicitudService.validarFechasVacacion(this.validarVacacion)
        .then((data) => {
          this.validarVacacion = data;

          this.vacacionForm.patchValue({
            fechaInicio: this.validarVacacion.fechaInicio,
            fechaFin: this.validarVacacion.fechaFin,
            fechaReintegro: this.validarVacacion.fechaReintegro,
            cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,
            jornada: this.validarVacacion.jornada,
          });

          // if(this.validarVacacion.jornada != Jornada.Ocultar)
          //   this.jornadaVisible = true;

          this.enProceso = false;
          // Alerts.closeLoad();
        })
        .catch(() => {
          this.vacacionForm.get('cantidadDiasVacacion').setValue(0);
          this.enProceso = false;
          // Alerts.closeLoad();
        });
    // }
  }

  jornadaChanged() {
    // Alerts.openLoad('');
    if (this.enProceso) return;
    this.enProceso = true;

    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd');
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd');
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd');
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorJornada;

    console.log('validarVacacionJ',this.validarVacacion);
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
      .then((data) => {
        this.validarVacacion = data;

        this.vacacionForm.patchValue({
          fechaInicio: this.validarVacacion.fechaInicio,
          fechaFin: this.validarVacacion.fechaFin,
          fechaReintegro: this.validarVacacion.fechaReintegro,
          cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,          
        });

        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion').setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  guardar() {
    Alerts.openLoad();
    this.nuevaSolicitudDeVacacion = this.vacacionForm.getRawValue();

    if (this.cantidadDiasPendientes <= 0) {
      Alerts.warning('Advertencia', 'No tiene días pendientes de vacación.');
      return;
    }

    if (this.nuevaSolicitudDeVacacion.cantidadDiasVacacion > this.cantidadDiasPendientes)
    {
      Alerts.warning('Advertencia', 'No tiene suficientes días pendientes de vacación.');
      return;
    }

    this.solicitudService.guardarSolicitudDeVacacion(this.nuevaSolicitudDeVacacion)
      .then((data) => {
        this.solicitudesDeVacacion = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        Alerts.closeLoad();
        this.cerrarPopup();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopup()
      })
    console.log(this.nuevaSolicitudDeVacacion);
    
  }

  eliminar() {
    Alerts.openLoad();

    this.solicitudService.eliminarSolicitudDeVacacion(this.solicitudIdSeleccionada)
      .then((data) => {
        this.solicitudesDeVacacion = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupConfirmarEliminacion();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupConfirmarEliminacion()
      })
  }

}
