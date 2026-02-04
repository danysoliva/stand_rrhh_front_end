import { Component, Input, OnInit } from '@angular/core';
import { VoucherHorasExtrasDocDto } from '../../models/voucher-horas-extras-doc-dto';

@Component({
  selector: 'app-voucher-he-doc',
  templateUrl: './doc-voucher-horas-extras.component.html',
  styleUrls: ['./doc-voucher-horas-extras.component.css', '../../documentos.style.css']
})
export class DocVoucherHorasExtrasComponent implements OnInit {
  @Input() voucherHorasExtrasDoc: VoucherHorasExtrasDocDto ;
  @Input() reporteVoucerHorasExtrasEsVisible: boolean;
  
  constructor() { 
    this.voucherHorasExtrasDoc = new  VoucherHorasExtrasDocDto();      
  }

  now: Date = new Date();
  ngOnInit(): void {
    this.voucherHorasExtrasDoc = new VoucherHorasExtrasDocDto();  

        
  }

}
