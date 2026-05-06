import { Component, Input, OnInit } from '@angular/core';
import { VoucherDocDto } from '../../models/voucher-doc-dto';

@Component({
  selector: 'doc-voucher-new',
  templateUrl: './doc-voucher-new.component.html',
  styleUrls: ['./doc-voucher-new.component.css', '../../documentos.style.css']
})
export class DocVoucherNewComponent implements OnInit {
  @Input() voucherDoc: VoucherDocDto;
  @Input() reporteEsVisible: boolean;

  now: Date = new Date();
  logoSrc: string;

  constructor() {
    this.voucherDoc = new VoucherDocDto();
    this.reporteEsVisible = false;
    this.logoSrc = new URL('assets/images/aquafeed.png', document.baseURI).href;
  }

  ngOnInit(): void {
    if (!this.voucherDoc) {
      this.voucherDoc = new VoucherDocDto();
    }
  }
}
