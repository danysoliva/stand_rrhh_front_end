import { Component, Input, OnInit } from '@angular/core';
import { VoucherDocDto } from '../../models/voucher-doc-dto';

@Component({
  selector: 'app-voucher-doc',
  templateUrl: './doc-voucher.component.html',
  styleUrls: ['./doc-voucher.component.css', '../../documentos.style.css']
})
export class DocVoucherComponent implements OnInit {
  @Input() voucherDoc: VoucherDocDto ;
  @Input() reporteEsVisible: boolean;
  
  constructor() { 
    this.voucherDoc = new VoucherDocDto();      
  }

  now: Date = new Date();
  ngOnInit(): void {
    this.voucherDoc = new VoucherDocDto();  
  }

}
