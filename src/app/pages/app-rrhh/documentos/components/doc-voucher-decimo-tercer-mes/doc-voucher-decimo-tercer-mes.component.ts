import { Component, Input, OnInit } from '@angular/core';
import { VoucherDecimoTercerMesResponseDto } from '../../../../../model/maestro/VoucherDecimoTercerMesResponseDto';

@Component({
  selector: 'doc-voucher-DecimoTercer-Mes',
  templateUrl: './doc-voucher-decimo-tercer-mes.component.html',
  styleUrls: ['./doc-voucher-decimo-tercer-mes.component.css', '../../documentos.style.css']
})

 

export class DocVoucherDecimoTercerMesComponent implements OnInit {
  @Input() voucherDoc!: VoucherDecimoTercerMesResponseDto;
  @Input() reporteEsVisible: boolean;

  now: Date = new Date();
  logoSrc: string;
  totalPagar: number = 0;

  constructor() {
    this.reporteEsVisible = false;
    this.logoSrc = new URL('assets/images/aquafeed.png', document.baseURI).href;
  }

  ngOnInit(): void {
    if (!this.voucherDoc) {
      this.voucherDoc = new VoucherDecimoTercerMesResponseDto();
    }

    this.totalPagar= this.voucherDoc.detalle.find(item => item.codigo === 'NET')?.valor ?? 0;
    
    this.voucherDoc.detalle = this.voucherDoc.detalle .filter(item => item.codigo !== 'NET');

     
  }

 
}
