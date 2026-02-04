import { Component, Input, Output, EventEmitter } from '@angular/core';
import { pdf } from '@progress/kendo-drawing';

@Component({
  selector: 'app-doc-base',
  templateUrl: './app-doc-base.component.html',
  styleUrls: ['./app-doc-base.component.css', './../../documentos.style.css']
})
export class AppDocBaseComponent {
  @Input() isVisible: boolean;
  @Output() closed: EventEmitter<boolean>;
  @Input() filename: string;
  @Input() landscape: boolean = false;
  @Input() disablePrintMenu: boolean;
  @Input() showPaperSizeControl: boolean = false;
  @Input() customPaperSize: string;
  @Input() showMarginControl: boolean = false;
  @Input() customMargin: string;
  @Input() showScaleControl: boolean = false;
  @Input() customScale: number;
  paperSizes: string[];
  autoPrint:boolean;

  constructor() {
    pdf.defineFont({
      'DejaVu Sans':
        'https://cdn.kendostatic.com/2019.2.514/styles/fonts/DejaVu/DejaVuSans.ttf',

      'DejaVu Sans|Bold':
        'https://cdn.kendostatic.com/2019.2.514/styles/fonts/DejaVu/DejaVuSans-Bold.ttf',

      'DejaVu Sans|Bold|Italic':
        'https://cdn.kendostatic.com/2019.2.514/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf',

      'DejaVu Sans|Italic':
        'https://cdn.kendostatic.com/2019.2.514/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf'
    });
    this.disablePrintMenu = false;
    this.isVisible = false;
    this.closed = new EventEmitter<boolean>();
    this.customPaperSize = 'Letter';
    this.customMargin = '1.5';
    this.customScale = 0.6;
    this.paperSizes = [
      'A6',
      'A5',
      'A4',
      'A3',
      'A2',
      'A1',
      'A0',
      'Tabloid',
      'Legal',
      'Letter',
      'Folio',
      'Executive'
    ];

    this.autoPrint=true;
  }
  onClose(){
    this.closed.emit(false)
  }

  printPreview(){
    window.print()
  }


  openPrint(){
    var printContents = document.getElementById("documento").innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
     location.reload();
  }
}
