import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LoginDto } from '../../../../model/login/login-dto';
import { CambioEstadoSolicitudDto } from '../../../../model/solicitud/cambio-estado-solicitud-dto';
import { SolicitudVacacionDto } from '../../../../model/solicitud/solicitud-vacacion-dto';
import { SolicitudVacacionLogDto } from '../../../../model/solicitud/solicitud-vacacion-log-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { AccionEnum, EstadoSolicitudEnum, TipoAutorizacionEnum, UserLevelEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { iconoEstadoSolicitud, textoEstadoSolicitud } from '../../../../_common/utils/solicitud-estado-labels';
import { VacacionDocNewFormatDto } from '../../documentos/models/vacacion-doc-new-format-dto';

@Component({
  selector: 'ngx-listado-vacaciones',
  templateUrl: './listado-vacaciones.component.html',
  styleUrls: ['./listado-vacaciones.component.scss']
})
export class ListadoVacacionesComponent implements OnInit {

  estadosFiltro = [ {id:0,nombre:'Todas'},
                    {id:EstadoSolicitudEnum.EnProceso,nombre:'En Proceso'},
                    {id:EstadoSolicitudEnum.AprobadoPorJefeInmediato,nombre:'Aprobado por Jefe Inmediato'},
                    {id:EstadoSolicitudEnum.AprobadoPorRRHH,nombre:'Aprobado por RRHH'}]
  tipoAutorizacionEnum = TipoAutorizacionEnum
  tipoAutorizacionSeleccionada!:TipoAutorizacionEnum
  estadoSolicitudEnum = EstadoSolicitudEnum
  accionEnum = AccionEnum
  accionSeleccionada!:AccionEnum
  empleadoSeleccionado:string = "";
  solicitudVacacionIdSeleccionado:number = 0;
  popupAprobarDenegarVisible:boolean = false;
  solicitudesDeVacacion: Array<SolicitudVacacionDto> = new Array<SolicitudVacacionDto>();
  popupHistorialVisible = false;
  solicitudHistorialId = 0;
  historialItems: SolicitudVacacionLogDto[] = [];
  popupSubirOdoo:boolean = false;
  popupEliminarOdoo:boolean = false;

abrirPopupSubirOdoo=(solicitudId: number)=>{this.popupSubirOdoo=true;this.solicitudVacacionIdSeleccionado = solicitudId;}
abrirPopupEliminarSolicitud=(solicitudId: number)=>{this.popupEliminarOdoo=true;this.solicitudVacacionIdSeleccionado = solicitudId;}
cerrarPopupSubirOdoo=()=>{this.popupSubirOdoo=false;}
cerrarPopupEliminarSolicitud=()=>{this.popupEliminarOdoo=false;}

  abrirPopup = (tipoAutorizacion: TipoAutorizacionEnum, accion:AccionEnum, solicitudVacacionId:number, employeeName:string) => { 
    this.popupAprobarDenegarVisible = true; 
    this.solicitudVacacionIdSeleccionado = solicitudVacacionId; 
    this.tipoAutorizacionSeleccionada = tipoAutorizacion;
    this.accionSeleccionada = accion; 
    this.empleadoSeleccionado = employeeName;
  };
  cerrarPopup = () => { this.popupAprobarDenegarVisible = false };
  filename: string = "Vacación";
  reporteEsVisible:boolean = false;
  vacacion:VacacionDocNewFormatDto = new VacacionDocNewFormatDto();

  comentarioValido: boolean = false;
  fcComentario = new UntypedFormControl('');
  fcEstadoFiltro = new UntypedFormControl(EstadoSolicitudEnum.EnProceso);
  /** Por defecto ocultas; el checkbox «Mostrar las rechazadas» las incluye en el listado. */
  mostrarRechazadas = false;

  keyUpComentario(e:any){
    const inputValue = e.event.target.value;
    this.comentarioValido = inputValue.length > 0;
  }

  constructor(private solicitudService: SolicitudService) {
  }

  async ngOnInit(){
    const usuario = JSON.parse(localStorage.getItem('Auth') || '{}') as LoginDto;
    if (usuario.hasStaffInCharge == true && usuario.userLevelId == UserLevelEnum.Usuario) {
      this.fcEstadoFiltro.setValue(EstadoSolicitudEnum.EnProceso);
    }
    else if (usuario.userLevelId == UserLevelEnum.Administrador) {
      this.fcEstadoFiltro.setValue(0);
    }

    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.solicitudesDeVacacion = await this.solicitudService.obtenerSolicitudesDeVacacionPorEstadoIdParaRRHH(
      this.fcEstadoFiltro.value,
      this.mostrarRechazadas
    );
  }

  async filtroValueChanged(e: any) {
    this.fcEstadoFiltro.setValue(e.value);
    await this.cargarSolicitudes();
  }

  async mostrarRechazadasChanged(e: { value?: boolean }) {
    this.mostrarRechazadas = !!e.value;
    await this.cargarSolicitudes();
  }

  iconoEstadoSolicitud = iconoEstadoSolicitud;

  textoUsuarioHistorial(log: SolicitudVacacionLogDto): string {
    const nombre = (log.usuarioNombre || '').trim();
    if (nombre) {
      return nombre;
    }
    if (log.usuarioId != null) {
      return `Usuario #${log.usuarioId}`;
    }
    return '';
  }

  cerrarPopupHistorial = () => { this.popupHistorialVisible = false; };

  async abrirHistorial(solicitudId: number) {
    Alerts.openLoad();
    try {
      const data = await this.solicitudService.obtenerHistorialSolicitudVacacion(solicitudId);
      this.historialItems = (data || []).map((raw) => {
        const r = raw as SolicitudVacacionLogDto & Record<string, unknown>;
        return {
          ...r,
          fechaHora: r.fechaHora != null ? new Date(r.fechaHora as string | Date) : r.fechaHora,
          estadoAnteriorNombre: textoEstadoSolicitud(
            r.estadoAnteriorId ?? (r['estadoAnteriorId'] as unknown as number) ?? (r['EstadoAnteriorId'] as number),
            r.estadoAnteriorNombre ?? (r['estadoAnteriorNombre'] as unknown as string) ?? (r['EstadoAnteriorNombre'] as string)
          ),
          estadoNuevoNombre: textoEstadoSolicitud(
            r.estadoNuevoId ?? (r['estadoNuevoId'] as unknown as number) ?? (r['EstadoNuevoId'] as number),
            r.estadoNuevoNombre ?? (r['estadoNuevoNombre'] as unknown as string) ?? (r['EstadoNuevoNombre'] as string)
          ),
        };
      });
      this.solicitudHistorialId = solicitudId;
      this.popupHistorialVisible = true;
    } catch (e: any) {
      const msg = e?.error?.message ?? e?.message ?? 'No se pudo cargar el historial.';
      Alerts.error('Historial', msg);
    } finally {
      Alerts.closeLoad();
    }
  }

  imprimir(solicitudVacacionId:number){
    this.solicitudService.obtenerVacacionParaImpresion(solicitudVacacionId)
    .then((data) => {
      this.reporteEsVisible = true;
      this.vacacion = data;
      this.cerrarPopup();
    })
    .catch(() => this.cerrarPopup())
  }

  confirmar(){
    Alerts.openLoad();

    let cambiarEstadoSolicitud = new CambioEstadoSolicitudDto();
    let estadoId = null;
    if (this.tipoAutorizacionSeleccionada === this.tipoAutorizacionEnum.Jefatura && this.accionSeleccionada == AccionEnum.Aprobar) {
      estadoId = EstadoSolicitudEnum.AprobadoPorJefeInmediato;
    } else if (this.tipoAutorizacionSeleccionada === this.tipoAutorizacionEnum.Jefatura && this.accionSeleccionada == AccionEnum.Denegar) {
      estadoId = EstadoSolicitudEnum.RechazadoPorJefeInmediato;
    } else if (this.tipoAutorizacionSeleccionada === this.tipoAutorizacionEnum.RecursosHumanos && this.accionSeleccionada == AccionEnum.Aprobar) {
      estadoId = EstadoSolicitudEnum.AprobadoPorRRHH;
    } else if (this.tipoAutorizacionSeleccionada === this.tipoAutorizacionEnum.RecursosHumanos && this.accionSeleccionada == AccionEnum.Denegar) {
      estadoId = EstadoSolicitudEnum.RechazadoPorRRHH;
    }

    cambiarEstadoSolicitud.comentario = this.fcComentario.value;
    cambiarEstadoSolicitud.estadoId = estadoId ?? 0;
    cambiarEstadoSolicitud.solicitudId = this.solicitudVacacionIdSeleccionado;

    this.solicitudService.cambiarEstadoSolicitudDeVacacion(cambiarEstadoSolicitud)
    .then((data) => {
      this.solicitudesDeVacacion = data;
      Alerts.success('Éxito', 'El proceso finalizó correctamente.');
      this.fcEstadoFiltro.setValue(0);
      this.cerrarPopup();
    })
    .catch(() => {
      Alerts.openLoad(); 
      this.cerrarPopup();
    })
  }

  cancelar(){
    this.cerrarPopup();
  }


  confirmarOdoo(){
    this.solicitudService.sincronizarVacacionEnOdoo(this.solicitudVacacionIdSeleccionado).then(async () => {
      await this.cargarSolicitudes();
      Alerts.success('¡Éxito!','Se han sincronizado el dato');
      this.cerrarPopupSubirOdoo();
    })

  }

  confirmarEliminarSolicitud(){
    this.solicitudService.eliminarSolicitudComoAdministrador(this.solicitudVacacionIdSeleccionado).then(async () => {
      await this.cargarSolicitudes();
      Alerts.success('¡Éxito!','Se han eliminado el registro');
      this.cerrarPopupEliminarSolicitud();
    })

  }


}
