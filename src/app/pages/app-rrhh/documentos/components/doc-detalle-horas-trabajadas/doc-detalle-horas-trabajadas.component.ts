import { Component, Input, OnInit } from '@angular/core';

import { HoraEmpleadoDto } from "../../../../../model/maestro/hora-empleado-dto";

@Component({
  selector: 'doc-detalle-horas-trabajadas',
  templateUrl: './doc-detalle-horas-trabajadas.component.html',
  styleUrls: ['./doc-detalle-horas-trabajadas.component.css', '../../documentos.style.css']
})
export class DocDetalleHorasTrabajadasComponent implements OnInit {
  @Input() horasTrabajadasDoc: HoraEmpleadoDto;
  @Input() reporteEsVisible: boolean;
  
  constructor() { 
    this.horasTrabajadasDoc = new HoraEmpleadoDto();      
  }

  ngOnInit(): void {
    // this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();
  }

}
