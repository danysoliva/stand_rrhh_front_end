import { Component, Input, OnInit } from '@angular/core';
import { DeduccionPorPlanillaDocNewFormatDto } from '../../models/deduccion-por-planilla-doc-new-format-dto';

@Component({
  selector: 'doc-deduccion-planilla-new-format',
  templateUrl: './doc-deduccion-planilla-new-format.component.html',
  styleUrls: ['./doc-deduccion-planilla-new-format.component.css', '../../documentos.style.css']
})
export class DocDeduccionPlanillaNewFormatComponent implements OnInit {
  @Input() deduccionPlanillaDoc: DeduccionPorPlanillaDocNewFormatDto;
  @Input() reporteEsVisible: boolean;
  
  constructor() { 
    this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocNewFormatDto();      
  }

  ngOnInit(): void {
    // this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();
  }

}
