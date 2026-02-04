import { Component, OnInit, Input } from '@angular/core';
import { TipoSolicitudEnum } from '../../../../../model/solicitud/solicitud-constancia-dto';
import { ConstanciaTrabajoDocDto } from '../../models/constancia-trabajo-doc-dto';

@Component({
  selector: 'doc-constancia-trabajo',
  templateUrl: './doc-constancia-trabajo.component.html',
  styleUrls: ['./doc-constancia-trabajo.component.css', '../../documentos.style.css']
})

export class DocConstanciaTrabajoComponent implements OnInit {
  @Input() constanciaTrabajo: ConstanciaTrabajoDocDto;
  @Input() reporteEsVisible: boolean;
  TipoSolicitudEnum = TipoSolicitudEnum

  constructor() {
    this.constanciaTrabajo = new ConstanciaTrabajoDocDto();
  }
  
  ngOnInit() {
    this.constanciaTrabajo = new ConstanciaTrabajoDocDto();
  }
}