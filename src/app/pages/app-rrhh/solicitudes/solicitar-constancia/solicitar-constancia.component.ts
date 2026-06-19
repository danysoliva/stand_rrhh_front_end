import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import DataSource from 'devextreme/data/data_source';
import { ConceptoDto } from '../../../../model/solicitud/concepto-dto';
import { NuevaSolicitudConstanciaDto, SolicitudConstanciaDto, TipoSolicitudEnum } from '../../../../model/solicitud/solicitud-constancia-dto';
import { SolicitudConstanciaLogDto } from '../../../../model/solicitud/solicitud-constancia-log-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { EstadoSolicitudEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { iconoEstadoSolicitud, textoEstadoSolicitud } from '../../../../_common/utils/solicitud-estado-labels';
import { Helpers } from '../../../../_common/utils/helpers';
import { LoginDto } from '../../../../model/login/login-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-solicitar-constancia',
  templateUrl: './solicitar-constancia.component.html',
  styleUrls: ['./solicitar-constancia.component.scss']
})
export class SolicitarConstanciaComponent implements OnInit {

  tipoConstancias = [
    { id: 1, name: 'Con Anexos' },
    { id: 2, name: 'Sin Anexos' }
  ];
  estadoSolicitudEnum = EstadoSolicitudEnum;
  solicitudIdSeleccionada: number =0;
  fcTipoConstanciaId = new UntypedFormControl(null, Validators.required);
  solicitudesDeConstancias: Array<SolicitudConstanciaDto> = new Array<SolicitudConstanciaDto>();
  popupHistorialVisible = false;
  solicitudHistorialId = 0;
  historialItems: SolicitudConstanciaLogDto[] = [];
  popupSolicitarConstanciaVisible: boolean = false;
  popupConfirmarEliminacionVisible: boolean = false;
  abrirPopupSolicitarConstancia = () => { this.popupSolicitarConstanciaVisible = true };
  cerrarPopupSolicitarConstancia = () => { this.popupSolicitarConstanciaVisible = false };
  abrirPopupConfirmarEliminacion = (solicitudId: number) => { this.popupConfirmarEliminacionVisible = true; this.solicitudIdSeleccionada = solicitudId; };
  cerrarPopupConfirmarEliminacion = () => { this.popupConfirmarEliminacionVisible = false };
  isVisibleEliminarColumn: boolean = false;



  constructor(private solicitudService: SolicitudService, private router: Router) {
  }

  iconoEstadoSolicitud = iconoEstadoSolicitud;

  async ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('Auth')?? '{}') as LoginDto;
    
    if (!usuario || !usuario.empleadoId) {
      Alerts.error('Error', 'No se pudo obtener la información del usuario. Por favor, vuelva a iniciar sesión.');
       this.router.navigate(['/auth']);
    }

    if (usuario.userLevelId != 1) {
      this.isVisibleEliminarColumn = false;
    }

    await this.cargarMisSolicitudes();
  }

  async cargarMisSolicitudes() {
    this.solicitudesDeConstancias = await this.solicitudService.obtenerSolicitudesDeConstanciasPorEmpleadoId();
  }

  solicitar() {
    Alerts.openLoad();

    this.solicitudService.guardarSolicitudDeConstancia(this.fcTipoConstanciaId.value)
      .then(async () => {
        await this.cargarMisSolicitudes();
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupSolicitarConstancia();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupSolicitarConstancia()
      })
  }

  eliminar() {
    Alerts.openLoad();

    this.solicitudService.eliminarSolicitudDeConstancia(this.solicitudIdSeleccionada)
      .then(async () => {
        await this.cargarMisSolicitudes();
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupConfirmarEliminacion();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupConfirmarEliminacion()
      })
  }

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
            r.estadoAnteriorNombre ?? (r['estadoAnteriorNombre'] as unknown as string) ?? (r['EstadoAnteriorNombre'] as string)
          ),
          estadoNuevoNombre: textoEstadoSolicitud(
            r.estadoNuevoId ?? (r['estadoNuevoId'] as unknown as number) ?? (r['EstadoNuevoId'] as number),
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

}
