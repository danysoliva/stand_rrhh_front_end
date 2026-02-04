import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { pdf } from '@progress/kendo-drawing';
import { AppDocPopupComponent } from '../app-doc-popup/app-doc-popup.component';

@Component({
  selector: 'app-print-document-preview',
  templateUrl: './app-print-document-preview.component.html',
  styleUrls: ['./app-print-document-preview.component.css']
})
export class AppPrintDocumentPreviewComponent {
  constructor() 
  {
    pdf.defineFont({
      'DejaVu Sans':
        'assets/fonts/dejavu-sans/DejaVuSans.ttf',

      'DejaVu Sans|Bold':
        'assets/fonts/dejavu-sans/DejaVuSans-Bold.ttf',

      'DejaVu Sans|Bold|Italic':
        'assets/fonts/dejavu-sans/DejaVuSans-Oblique.ttf',

      'DejaVu Sans|Italic':
        'assets/fonts/dejavu-sans/DejaVuSans-Oblique.ttf'
    });
  }

  @Output() _FileSaved: EventEmitter<void> = new EventEmitter<void>();
  @Input() filename: string = 'documento';
  @Input() disablePrintMenu: boolean = false;
  @Input() useCustomSettings: boolean = false;
  @Input() customPaperSize: string = 'Letter';
  @Input() customMargin: string = '1';
  @Input() customScale: number = 0.6;
  paperSizes: string[] = [
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
    'Executive',
    'auto'
  ];
  @ViewChild('printDocumentPreviewPopup') printDocumentPreviewPopup: AppDocPopupComponent;


  showDocumentPreview(title: string = 'Vista previa', filename: string = 'documento') 
  {
    this.printDocumentPreviewPopup.show(title);
    this.filename = filename;
  }

  print(pdfExport) 
  {
    pdfExport.saveAs(this.filename);
    this._FileSaved.emit();
  }
}
