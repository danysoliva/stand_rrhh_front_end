import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { drawDOM, exportPDF, Group } from '@progress/kendo-drawing';
import Swal from 'sweetalert2';
import { DeduccionDto } from '../../../../../model/gestiones-varias/deduccion-dto';
import { DeduccionNewFormatDto } from '../../../../../model/gestiones-varias/deduccion-new-format-dto';
import { EmpleadoDto } from '../../../../../model/gestiones-varias/empleado-dto';
import { GestionesVariasService } from '../../../../../servicio/gestiones-varias.service';
import { Alerts } from '../../../../../_common/utils/alerts';
import { AppPrintDocumentPreviewComponent } from '../../../documentos/components/app-print-document-preview/app-print-document-preview.component';
import { DeduccionPorPlanillaDocDto } from '../../../documentos/models/deduccion-por-planilla-doc-dto';

@Component({
  selector: 'ngx-deduccion-planilla',
  templateUrl: './deduccion-planilla.component.html',
  styleUrls: ['./deduccion-planilla.component.scss']
})
export class DeduccionPlanillaComponent implements OnInit {

  @ViewChild('pdfDeduccionContainer') pdfDeduccionContainer!: ElementRef<HTMLDivElement>;

  popupVisible:boolean = false;
  popupVisibleNewFormat:boolean = false;

  popupDelete:boolean = false;
  popupVisibleNotificacion:boolean = false;
  reporteEsVisible: boolean;
  reporteEsVisibleNewFormat: boolean;
  filename = "DeduccionPorPlanilla";
  monedaDeduccion:string;

  deducciones: DeduccionDto[];
  formatoDeduccion:DeduccionPorPlanillaDocDto = new DeduccionPorPlanillaDocDto();
  comentarioValido:boolean = false;
  deduccionIdSeleccionado:number;


  abrirPopup = () => { this.popupVisible = true };
  abrirPopupMewFormat = () => { this.popupVisible = true };
  abrirPopupDelete = (deduccioId:number) => { this.popupDelete = true ,this.deduccionIdSeleccionado=deduccioId};

  cerrarPopup = () => { this.popupVisible = false };
  cerrarPopupNewFormat = () => { this.popupVisible = false };
  
  cerrarPopupDelete = () => { this.popupDelete = false };
  @ViewChild(AppPrintDocumentPreviewComponent) printDocumentPreviewPopup: AppPrintDocumentPreviewComponent;


  meses=[ {id:1, mes:'Enero'},
           {id:2,mes:'Febrero'},
           {id:3,mes:'Marzo'},
           {id:4,mes:'Abril'},
           {id:5,mes:'Mayo'},
           {id:6,mes:'Junio'},
           {id:7,mes:'Julio'},
           {id:8,mes:'Agosto'},
           {id:9,mes:'Septiembre'},
           {id:10,mes:'Octubre'},
           {id:11,mes:'Noviembre'},
           {id:12,mes:'Diciembre'}]


  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: any = 'name';
  now: Date = new Date();
  currencyButton: any;
  currencyFormat: string;
  
  empleados: EmpleadoDto[];
  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private gestionesVariasService: GestionesVariasService,
    private cdr: ChangeDetectorRef
  ) { 
   
  }

  deduccionForm = this.fb.group({
    empleado_id: [null, Validators.required],
    fecha_deduccion: [new Date(), Validators.required],
    monto: [null, [Validators.required,Validators.min(1)]],
    concepto: [''],
  });
  ngOnInit(): void {

    this.gestionesVariasService.obtenerEmpleados().then((data)=>{
      this.empleados=data;
    })

    this.gestionesVariasService.obtenerDeducciones().then((data)=>{
      this.deducciones=data;
    })

    this.currencyFormat = 'L #.##';

    this.monedaDeduccion='L'

    this.currencyButton = {
      text: 'L',
      stylingMode: 'text',
      width: 32,
      elementAttr: {
        class: 'currency',
      },
      onClick: (e) => {
        if (e.component.option('text') === 'USD') {
          e.component.option('text', 'L');
          this.currencyFormat = 'L #.##';
          this.monedaDeduccion='L'
        } else {
          e.component.option('text', 'USD');
          this.currencyFormat = 'USD #.##';
          this.monedaDeduccion='USD'
        }
      },
    };
  }


    generarDeduccion(){
      this.abrirPopup();
    }

    // cancelar(){
    //   this.cerrarPopup();
    // }

    save(){
      //  console.log(this.deduccionForm);
      let paramsDeduccion={
        employeeId:this.deduccionForm.value.empleado_id,
        monto:this.deduccionForm.value.monto,
        fechaDeduccion:this.datePipe.transform( this.deduccionForm.value.fecha_deduccion,"yyyy-MM-dd"),
        usuarioCreacionId:0,
        concepto:this.deduccionForm.value.concepto,
        currency:this.monedaDeduccion
      }

      this.gestionesVariasService
        .guardarDeduccion(paramsDeduccion)
        .then((data) => {
          if (data === true) {
            this.deducciones = [];

            this.gestionesVariasService.obtenerDeducciones().then((data) => {
              this.deducciones = data;
            });

            this.deduccionForm.reset();
            Alerts.success("Éxito!", "Se han guardado los datos");

            this.cerrarPopup();
          }
        });

      
    }

    private asignarFormatoDeduccion(data: DeduccionNewFormatDto): void {
      this.formatoDeduccion.nombreEmpleado = data.nombreEmpleado;
      this.formatoDeduccion.barcode = data.barcode;
      this.formatoDeduccion.monto = data.monto;
      this.formatoDeduccion.identidad = data.identidad;
      this.formatoDeduccion.fechaDeduccion = data.fechaDeduccion;
      this.formatoDeduccion.fechaCreacion = data.fechaCreacion;
      this.formatoDeduccion.concepto = data.concepto;
      this.formatoDeduccion.currency = data.currency;
      this.formatoDeduccion.fechaIngreso = data.fechaIngreso;
    }

    print(e){
      this.gestionesVariasService.imprimirFormatoDeduccionPlanilla(e.data.id).then((data)=>{      
        this.asignarFormatoDeduccion(data);
        this.reporteEsVisibleNewFormat=true;     
      }).catch((excep)=>{

        console.log(excep.error.message);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: excep.error.message
        })
        
      });
      
    }

    async printPdf(e: { data: DeduccionDto }): Promise<void> {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        Swal.fire({
          icon: 'warning',
          title: 'Ventana bloqueada',
          text: 'Permita ventanas emergentes para ver el PDF.'
        });
        return;
      }

      Alerts.openLoad();

      try {
        const data = await this.gestionesVariasService.imprimirFormatoDeduccionPlanilla(e.data.id);
        this.asignarFormatoDeduccion(data);
        this.cdr.detectChanges();
        await this.waitForViewRender();

        if (!this.pdfDeduccionContainer?.nativeElement) {
          throw new Error('No se encontró el contenedor para exportar PDF.');
        }

        await this.waitForImages(this.pdfDeduccionContainer.nativeElement);

        const documentElement = this.pdfDeduccionContainer.nativeElement.querySelector('#documento') as HTMLElement;
        if (!documentElement) {
          throw new Error('No se encontró el contenido del documento para exportar PDF.');
        }

        const group: Group = await drawDOM(documentElement, {
          paperSize: 'Letter',
          margin: {
            top: '0.35cm',
            right: '0.5cm',
            bottom: '0.35cm',
            left: '0.5cm'
          },
          scale: 0.56
        });

        const pdfDataUri = await exportPDF(group);
        const pdfBlob = await fetch(pdfDataUri).then((response) => response.blob());
        const objectUrl = URL.createObjectURL(pdfBlob);
        printWindow.location.href = objectUrl;
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
        Alerts.closeLoad();
      } catch (err) {
        printWindow.close();
        Alerts.closeLoad();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el PDF.'
        });
      }
    }

    private waitForViewRender(): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, 100));
    }

    private async waitForImages(container: HTMLElement): Promise<void> {
      const images = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];
      if (images.length === 0) {
        return;
      }

      await Promise.all(images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        });
      }));
    }

    keyUpComentario(e) {
      const inputValue = e.event.target.value;
      this.comentarioValido = inputValue.length > 0;    
    }

delete(e){
  
 this.abrirPopupDelete(e);
  
}

confirmarDelete(){
  this.gestionesVariasService.eliminarDeduccion(this.deduccionIdSeleccionado).then((data)=>{

    this.deducciones=data;

    Alerts.success('Éxito!','Se ha eliminado el registro');

    this.cerrarPopupDelete();
  })
}

}
