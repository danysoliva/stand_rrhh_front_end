import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import DataSource from 'devextreme/data/data_source';
import { ConceptoDto } from '../../../../model/solicitud/concepto-dto';
import { NuevaSolicitudConstanciaDto, SolicitudConstanciaDto, TipoSolicitudEnum } from '../../../../model/solicitud/solicitud-constancia-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { EstadoSolicitudEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { Helpers } from '../../../../_common/utils/helpers';

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
  solicitudIdSeleccionada: number;
  fcTipoConstanciaId = new UntypedFormControl(null, Validators.required);
  solicitudesDeConstancias: Array<SolicitudConstanciaDto> = new Array<SolicitudConstanciaDto>();
  popupSolicitarConstanciaVisible: boolean = false;
  popupConfirmarEliminacionVisible: boolean = false;
  abrirPopupSolicitarConstancia = () => { this.popupSolicitarConstanciaVisible = true };
  cerrarPopupSolicitarConstancia = () => { this.popupSolicitarConstanciaVisible = false };
  abrirPopupConfirmarEliminacion = (solicitudId: number) => { this.popupConfirmarEliminacionVisible = true; this.solicitudIdSeleccionada = solicitudId; };
  cerrarPopupConfirmarEliminacion = () => { this.popupConfirmarEliminacionVisible = false };

  constructor(private solicitudService: SolicitudService) {
  }

  async ngOnInit() {
    this.solicitudesDeConstancias = await this.solicitudService.obtenerSolicitudesDeConstanciasPorEmpleadoId();
  }

  solicitar() {
    Alerts.openLoad();

    this.solicitudService.guardarSolicitudDeConstancia(this.fcTipoConstanciaId.value)
      .then((data) => {
        this.solicitudesDeConstancias = data;
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
      .then((data) => {
        this.solicitudesDeConstancias = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupConfirmarEliminacion();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupConfirmarEliminacion()
      })
  }

}
