import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DeduccionDto } from '../../../../../model/gestiones-varias/deduccion-dto';
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
  constructor(private fb: UntypedFormBuilder,private datePipe: DatePipe,private gestionesVariasService: GestionesVariasService) { 
   
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

    print(e){
      this.gestionesVariasService.imprimirFormatoDeduccionPlanilla(e.data.id).then((data)=>{      

      this.formatoDeduccion.nombreEmpleado=data.nombreEmpleado;
      this.formatoDeduccion.barcode=data.barcode;
      this.formatoDeduccion.monto=data.monto;
      this.formatoDeduccion.identidad=data.identidad;
      this.formatoDeduccion.fechaDeduccion=data.fechaDeduccion;
      this.formatoDeduccion.fechaCreacion=data.fechaCreacion;
      this.formatoDeduccion.concepto=data.concepto; 
      this.formatoDeduccion.currency=data.currency;
      this.formatoDeduccion.fechaIngreso=data.fechaIngreso   
      // this.reporteEsVisible=true;
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
