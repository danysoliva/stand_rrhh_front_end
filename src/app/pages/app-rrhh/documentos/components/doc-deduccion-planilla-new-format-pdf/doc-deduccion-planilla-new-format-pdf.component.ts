import { Component, Input, OnInit } from '@angular/core';
import { DeduccionPorPlanillaDocDto } from '../../models/deduccion-por-planilla-doc-dto';

@Component({
  selector: 'doc-deduccion-planilla-new-format-pdf',
  templateUrl: './doc-deduccion-planilla-new-format-pdf.component.html',
  styleUrls: ['./doc-deduccion-planilla-new-format-pdf.component.css']
})
export class DocDeduccionPlanillaNewFormatPdfComponent implements OnInit {
  @Input() deduccionPlanillaDoc: DeduccionPorPlanillaDocDto;
  @Input() reporteEsVisible: boolean = false;

  constructor() {
    this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();
  }

  ngOnInit(): void {
    if (!this.deduccionPlanillaDoc) {
      this.deduccionPlanillaDoc = new DeduccionPorPlanillaDocDto();
    }
  }
}
