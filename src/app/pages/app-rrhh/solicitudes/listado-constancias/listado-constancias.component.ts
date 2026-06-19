import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { NbMenuService } from '@nebular/theme';
import DataSource from 'devextreme/data/data_source';
import { LoginDto } from '../../../../model/login/login-dto';
import { CambioEstadoSolicitudDto } from '../../../../model/solicitud/cambio-estado-solicitud-dto';
import { ConceptoDto } from '../../../../model/solicitud/concepto-dto';
import { SolicitudConstanciaDto } from '../../../../model/solicitud/solicitud-constancia-dto';
import { SolicitudConstanciaLogDto } from '../../../../model/solicitud/solicitud-constancia-log-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { EstadoSolicitudEnum, UserLevelEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { iconoEstadoSolicitud, textoEstadoSolicitud } from '../../../../_common/utils/solicitud-estado-labels';
import { ConstanciaTrabajoDocDto } from '../../documentos/models/constancia-trabajo-doc-dto';
import { Router } from '@angular/router';

export enum Deduccion {
  Depreciacion = 9876
}

@Component({
  selector: 'ngx-listado-constancias',
  templateUrl: './listado-constancias.component.html',
  styleUrls: ['./listado-constancias.component.scss']
})
export class ListadoConstanciasComponent implements OnInit {

  estadosFiltro = [ {id:0,nombre:'Todas'},
                    {id:EstadoSolicitudEnum.EnProceso,nombre:'En Proceso'},
                    {id:EstadoSolicitudEnum.Aprobado,nombre:'Aprobado'}]
  monedas = [{id:1,nombre:'Lempiras'},{id:2,nombre:'Dolares'}] 
  depreciacionValida: boolean = false;
  depreciacionVisible: boolean = false;
  fcValorDepreciacion = new UntypedFormControl(0);
  fcMoneda = new UntypedFormControl(1, Validators.required);
  conceptos: any | DataSource
  conceptosSeleccionados: ConceptoDto[] = [];
  estadoSolicitudEnum = EstadoSolicitudEnum
  empleadoSeleccionado: string = "";
  solicitudConstanciaIdSeleccionado: number =0;
  solicitudesDeConstancias: Array<SolicitudConstanciaDto> = new Array<SolicitudConstanciaDto>();
  popupHistorialVisible = false;
  solicitudHistorialId = 0;
  historialItems: SolicitudConstanciaLogDto[] = [];
  popupAprobarVisible: boolean = false;
  popupDenegarVisible: boolean = false;
  
  abrirPopupAprobar = (constanciaId: number, employeeName: string) => { 
    this.popupAprobarVisible = true; 
    this.solicitudConstanciaIdSeleccionado = constanciaId; 
    this.empleadoSeleccionado = employeeName;
    this.fcValorDepreciacion.reset(0);
    this.fcMoneda.reset(1);
    this.depreciacionValida = false;
    
  };
  cerrarPopupAprobar = () => { this.popupAprobarVisible = false };
  abrirPopupDenegar = (constanciaId: number, employeeName: string) => { this.popupDenegarVisible = true; this.solicitudConstanciaIdSeleccionado = constanciaId; this.empleadoSeleccionado = employeeName };
  cerrarPopupDenegar = () => { this.popupDenegarVisible = false };
  filename: string = "Constancia de Trabajo";
  reporteEsVisible: boolean=false;
  constanciaTrabajo: ConstanciaTrabajoDocDto = new ConstanciaTrabajoDocDto();

  comentarioValido: boolean = false;
  fcComentario = new UntypedFormControl('');
  fcEstadoFiltro = new UntypedFormControl(EstadoSolicitudEnum.EnProceso);
  /** Por defecto ocultas; el checkbox «Mostrar las denegadas» las incluye en el listado. */
  mostrarDenegadas = false;

  keyUpComentario(e: any) {
    const inputValue = e.event.target.value;
    this.comentarioValido = inputValue.length > 0;
  }

  keyUpDepreciacion(e: any) {
    const inputValue = e.event.target.value;
    this.depreciacionValida = this.depreciacionVisible === true && inputValue > 0;
    // if (this.depreciacionValida)
    //   this.conceptosSeleccionados.forEach(c => {
    //     c.valor = (c.id == Deduccion.Depreciacion) ? +inputValue : c.valor;
    //   });
  }
  constructor(private solicitudService: SolicitudService,  private router: Router,private menuService: NbMenuService) {
  }

  async ngOnInit() {

    const usuario = JSON.parse(localStorage.getItem('Auth')?? '{}') as LoginDto;

    if (!usuario || !usuario.empleadoId) {
      Alerts.error('Error', 'No se pudo obtener la información del usuario. Por favor, vuelva a iniciar sesión.');
       this.router.navigate(['/auth']);
    }

    if (usuario.hasStaffInCharge == true && usuario.userLevelId == UserLevelEnum.Usuario) {
      this.fcEstadoFiltro.setValue(EstadoSolicitudEnum.EnProceso);
    }
    else if (usuario.userLevelId == UserLevelEnum.Administrador) {
      this.fcEstadoFiltro.setValue(0);
    }

    this.conceptos = await this.solicitudService.obtenerConceptosConfigurables();

    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.solicitudesDeConstancias = await this.solicitudService.obtenerSolicitudesDeConstanciasPorEstadoIdParaRRHH(
      this.fcEstadoFiltro.value,
      this.mostrarDenegadas
    );
  }

  async filtroValueChanged(e: any) {
    this.fcEstadoFiltro.setValue(e.value);
    await this.cargarSolicitudes();
  }

  async mostrarDenegadasChanged(e: { value?: boolean }) {
    this.mostrarDenegadas = !!e.value;
    await this.cargarSolicitudes();
  }

  imprimir(solicitudConstanciaId: number) {
    this.solicitudService.obtenerConstanciaParaImpresion(solicitudConstanciaId)
      .then((data) => {
        this.reporteEsVisible = true;
        this.constanciaTrabajo = data;
      })
  }

  iconoEstadoSolicitud = iconoEstadoSolicitud;

  textoUsuarioHistorial(log: SolicitudConstanciaLogDto): string {
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
      const data = await this.solicitudService.obtenerHistorialSolicitudConstancia(solicitudId);
      this.historialItems = (data || []).map((raw) => {
        const r = raw as SolicitudConstanciaLogDto & Record<string, unknown>;
        return {
          ...r,
          fechaHora: r.fechaHora != null ? new Date(r.fechaHora as string | Date) : r.fechaHora,
          estadoAnteriorNombre: textoEstadoSolicitud(
            r.estadoAnteriorId ?? (r['estadoAnteriorId'] as unknown as number) ?? (r['EstadoAnteriorId'] as number),
            r.estadoAnteriorNombre ?? (r['estadoAnteriorNombre'] as unknown  as string) ?? (r['EstadoAnteriorNombre'] as string)
          ),
          estadoNuevoNombre: textoEstadoSolicitud(
            r.estadoNuevoId ?? (r['estadoNuevoId'] as unknown  as number) ?? (r['EstadoNuevoId'] as number),
            r.estadoNuevoNombre ?? (r['estadoNuevoNombre'] as unknown  as string) ?? (r['EstadoNuevoNombre'] as string)
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


  aprobar() {
    Alerts.openLoad();

    let cambiarEstadoSolicitud = new CambioEstadoSolicitudDto();
    cambiarEstadoSolicitud.estadoId = EstadoSolicitudEnum.Aprobado;
    cambiarEstadoSolicitud.solicitudId = this.solicitudConstanciaIdSeleccionado;
    this.conceptosSeleccionados.forEach(c => {
      if (c.id == Deduccion.Depreciacion) {
        c.valor = this.fcValorDepreciacion.value;
        c.moneda = this.fcMoneda.value;  
      }
    });
    cambiarEstadoSolicitud.conceptos = this.conceptosSeleccionados;
    
    this.solicitudService.cambiarEstadoSolicitudConstancia(cambiarEstadoSolicitud)
      .then((data) => {
        this.solicitudesDeConstancias = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupAprobar();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupAprobar()
      })
  }

  denegar() {
    Alerts.openLoad();
    let cambiarEstadoSolicitud = new CambioEstadoSolicitudDto();
    cambiarEstadoSolicitud.estadoId = EstadoSolicitudEnum.Denegado;
    cambiarEstadoSolicitud.comentario = this.fcComentario.value;
    cambiarEstadoSolicitud.solicitudId = this.solicitudConstanciaIdSeleccionado;

    this.solicitudService.cambiarEstadoSolicitudConstancia(cambiarEstadoSolicitud)
      .then(async () => {
        await this.cargarSolicitudes();
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupDenegar();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupDenegar()
      })
  }

  onSelectAllListChanged(e: any) {
    this.depreciacionVisible = e.value;

    if (this.depreciacionVisible == false){
      this.depreciacionValida = false;
      this.fcValorDepreciacion.setValue(0);
      this.fcMoneda.setValue(1);
    }
  }

  onSelectionListChanged(e: any ) {
    let deduccionIdAgregado = (e.addedItems.length > 0) ? e.addedItems[0].id : 0;
    if (deduccionIdAgregado == Deduccion.Depreciacion) {
      this.depreciacionVisible = true;
    }

    let deduccionIdRemovido = (e.removedItems.length > 0) ? e.removedItems[0].id : 0;
    if (deduccionIdRemovido == Deduccion.Depreciacion) {
      this.depreciacionVisible = false;
      this.depreciacionValida = false;
      this.fcValorDepreciacion.setValue(0);
      this.fcMoneda.setValue(1);
    }
  }

}
