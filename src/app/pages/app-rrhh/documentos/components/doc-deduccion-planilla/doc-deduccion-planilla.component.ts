import { Component, Input, OnInit } from '@angular/core';
import { DeduccionPorPlanillaDocDto } from '../../models/deduccion-por-planilla-doc-dto';

@Component({
  selector: 'doc-deduccion-planilla',
  templateUrl: './doc-deduccion-planilla.component.html',
  styleUrls: ['./doc-deduccion-planilla.component.css', '../../documentos.style.css']
})
export class DocDeduccionPlanillaComponent implements OnInit {
  @Input() deduccionPlanillaDoc: DeduccionPorPlanillaDocDto;
  @Input() reporteEsVisible: boolean;
  
  constructor() { 
    this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();      
  }

  ngOnInit(): void {
    // this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();
  }

}
