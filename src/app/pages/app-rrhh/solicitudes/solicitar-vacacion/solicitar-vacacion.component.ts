import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { drawDOM, exportPDF, Group } from '@progress/kendo-drawing';
import { NuevaSolicitudVacacionDto, SolicitudVacacionDto } from '../../../../model/solicitud/solicitud-vacacion-dto';
import { TipoVerificacionEnum, ValidarVacacionDto } from '../../../../model/solicitud/validar-vacacion-dto';
import { SolicitudService } from '../../../../servicio/solicitud.service';
import { EstadoSolicitudEnum } from '../../../../_common/enums';
import { Alerts } from '../../../../_common/utils/alerts';
import { TipoVacacionDto } from '../../../../model/solicitud/tipo-vacacion-dto';
import { VacacionDocNewFormatDto } from '../../documentos/models/vacacion-doc-new-format-dto';

export enum Jornada {
  Ocultar = 0,
  Mañana = 1,
  Tarde = 2
}

@Component({
  selector: 'ngx-solicitar-vacacion',
  templateUrl: './solicitar-vacacion.component.html',
  styleUrls: ['./solicitar-vacacion.component.scss']
})
export class SolicitarVacacionComponent implements OnInit {
  @ViewChild('pdfContainer') pdfContainer!: ElementRef<HTMLDivElement>;

  // jornadas: string[];
  jornadas = [
    { id: 1, nombre: 'Mañana' },
    { id: 2, nombre: 'Tarde' }
  ];

  cantidadDiasPendientes: number =0;
  estadoSolicitudEnum = EstadoSolicitudEnum;
  solicitudIdSeleccionada:number =0;
  popupVisible: boolean = false;
  popupConfirmarEliminacionVisible: boolean = false;
  abrirPopup = () => { this.popupVisible = true; }
  cerrarPopup = () => { this.popupVisible = false; };
  abrirPopupConfirmarEliminacion = (solicitudId: number) => { this.popupConfirmarEliminacionVisible = true; this.solicitudIdSeleccionada = solicitudId; };
  cerrarPopupConfirmarEliminacion = () => { this.popupConfirmarEliminacionVisible = false };

  validarVacacion: ValidarVacacionDto = new ValidarVacacionDto();
  nuevaSolicitudDeVacacion: NuevaSolicitudVacacionDto = new NuevaSolicitudVacacionDto();
  solicitudesDeVacacion: Array<SolicitudVacacionDto> = new Array<SolicitudVacacionDto>();
  tipoDeVacaciones: Array<TipoVacacionDto> = new Array<TipoVacacionDto>();
  startDate: Date = new Date();
  endDate: Date = new Date();
  reporteEsVisible: boolean = false;
  vacacion: VacacionDocNewFormatDto = new VacacionDocNewFormatDto();
  filename: string = "Vacación";

  vacacionForm = this.fb.group({
    fechaInicio: [new Date().toISOString(), Validators.required],
    fechaFin: [new Date().toISOString(), Validators.required],
    fechaReintegro: [new Date().toISOString(), Validators.required],
    cantidadDiasVacacion: [0, [Validators.required, Validators.min(0.5)]],
    jornada: [0],
    cubreVacaciones: ['', Validators.required],
    observaciones: [''],
    tipoVacacion: [1,Validators.required],
    actividadesPendientes: ['']
  });
  today = new Date().toISOString();


  constructor(
    private fb: UntypedFormBuilder,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    // this.jornadas = this.jornadaEntidad.map(j => j.nombre);

    this.solicitudService.obtenerSolicitudesDeVacacionesPorEmpleadoId()
      .then((data) => {
        this.solicitudesDeVacacion = data;
      })

      this.solicitudService.ObtenerTipoVacaciones()
      .then((data)=>{
        this.tipoDeVacaciones=data;
        
        // console.log(data);
      });

      
  }

  async solicitarVacacion() {    
    this.jornadaVisible = false;
    this.vacacionForm.controls.cantidadDiasVacacion.setValue(0);
    this.vacacionForm.controls.jornada.setValue(0);
    this.vacacionForm.controls.cubreVacaciones.setValue('');
    this.vacacionForm.controls.observaciones.setValue('');
    this.vacacionForm.controls.fechaInicio.setValue(this.today);
    this.vacacionForm.controls.fechaFin.setValue(this.today);
    this.vacacionForm.controls.fechaReintegro.setValue(this.today);
    this.vacacionForm.controls.tipoVacacion.setValue(0);

    this.cantidadDiasPendientes = await this.solicitudService.obtenerDiasPendientesDeVacacion();    
    this.abrirPopup();
  }

  fechaInicioChanged(e : any) {
    // Alerts.openLoad('');
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;

    if (this.validarVacacion.fechaInicio > this.validarVacacion.fechaFin) {
      this.vacacionForm.patchValue({
        fechaFin: this.validarVacacion.fechaInicio 
      });
      return;
    }

    if (this.enProceso) return;
    this.enProceso = true;

    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd')!;
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorFecha;
    
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
      .then((data) => {
        this.validarVacacion = data;

        this.vacacionForm.patchValue({
          fechaFin: this.validarVacacion.fechaFin,
          fechaReintegro: this.validarVacacion.fechaReintegro,
          cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion
        });

        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion')!.setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  fechaFinChanged(e:any) {
    // Alerts.openLoad('');
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;

    if (this.validarVacacion.fechaFin < this.validarVacacion.fechaInicio) {
      this.vacacionForm.patchValue({
        fechaInicio: this.validarVacacion.fechaFin,
        jornada: this.validarVacacion.jornada
      });
      return;
    }

    if (this.enProceso) return;
    this.enProceso = true;

    
    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd')!;
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorFecha;
    
    
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
    .then((data) => {
   
      this.validarVacacion = data;
      
      this.vacacionForm.patchValue({          
        fechaFin: this.validarVacacion.fechaFin,
        fechaReintegro: this.validarVacacion.fechaReintegro,
        cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,
        jornada: this.validarVacacion.jornada
      });

      
        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion')!.setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  cantidadDiasVacacionOnContentReady(e:any){
    // console.log(e);
    let inp = e.element.querySelector(".dx-texteditor-input");  
    // console.log(inp);
    
    if (inp) {  
      inp.addEventListener('focus', function() {  
        inp.select();  
      });  
    }  
  }

  enProceso: boolean = false;
  contador: number = 0;
  jornadaVisible: boolean = false;
  cantidadDiasVacacionChanged(e : any) {
 
      if (e.value < 0 || this.enProceso) return;
      this.enProceso = true;      
      
      this.contador = 1;
      this.validarVacacion = this.vacacionForm.getRawValue();
      this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
      this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;
      this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd')!;
      this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorDias;
 
      
      this.solicitudService.validarFechasVacacion(this.validarVacacion)
        .then((data) => {
          this.validarVacacion = data;

          this.vacacionForm.patchValue({
            fechaInicio: this.validarVacacion.fechaInicio,
            fechaFin: this.validarVacacion.fechaFin,
            fechaReintegro: this.validarVacacion.fechaReintegro,
            cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,
            jornada: this.validarVacacion.jornada,
          });

          // if(this.validarVacacion.jornada != Jornada.Ocultar)
          //   this.jornadaVisible = true;

          this.enProceso = false;
          // Alerts.closeLoad();
        })
        .catch(() => {
          this.vacacionForm.get('cantidadDiasVacacion')!.setValue(0);
          this.enProceso = false;
          // Alerts.closeLoad();
        });
    // }
  }

  jornadaChanged() {
    // Alerts.openLoad('');
    if (this.enProceso) return;
    this.enProceso = true;

    this.validarVacacion = this.vacacionForm.getRawValue();
    this.validarVacacion.fechaInicio = this.datePipe.transform(this.validarVacacion.fechaInicio, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaFin = this.datePipe.transform(this.validarVacacion.fechaFin, 'yyyy-MM-dd')!;
    this.validarVacacion.fechaReintegro = this.datePipe.transform(this.validarVacacion.fechaReintegro, 'yyyy-MM-dd')!;
    this.validarVacacion.tipoVerificacion = TipoVerificacionEnum.PorJornada;

 
    this.solicitudService.validarFechasVacacion(this.validarVacacion)
      .then((data) => {
        this.validarVacacion = data;

        this.vacacionForm.patchValue({
          fechaInicio: this.validarVacacion.fechaInicio,
          fechaFin: this.validarVacacion.fechaFin,
          fechaReintegro: this.validarVacacion.fechaReintegro,
          cantidadDiasVacacion: this.validarVacacion.cantidadDiasVacacion,          
        });

        this.enProceso = false;
        // Alerts.closeLoad();
      })
      .catch(() => {
        this.vacacionForm.get('cantidadDiasVacacion')!.setValue(0);
        this.enProceso = false;
        // Alerts.closeLoad();
      });
  }

  guardar() {
    Alerts.openLoad();
    this.nuevaSolicitudDeVacacion = this.vacacionForm.getRawValue();

    if (this.cantidadDiasPendientes <= 0) {
      Alerts.warning('Advertencia', 'No tiene días pendientes de vacación.');
      return;
    }

    if (this.nuevaSolicitudDeVacacion.cantidadDiasVacacion > this.cantidadDiasPendientes)
    {
      Alerts.warning('Advertencia', 'No tiene suficientes días pendientes de vacación.');
      return;
    }

    this.solicitudService.guardarSolicitudDeVacacion(this.nuevaSolicitudDeVacacion)
      .then((data) => {
        this.solicitudesDeVacacion = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        Alerts.closeLoad();
        this.cerrarPopup();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopup()
      })
    
  }

  eliminar() {
    Alerts.openLoad();

    this.solicitudService.eliminarSolicitudDeVacacion(this.solicitudIdSeleccionada)
      .then((data) => {
        this.solicitudesDeVacacion = data;
        Alerts.success('Éxito', 'El proceso finalizó correctamente.');
        this.cerrarPopupConfirmarEliminacion();
      })
      .catch(() => {
        Alerts.closeLoad();
        this.cerrarPopupConfirmarEliminacion()
      })
  }

  imprimir(solicitudVacacionId:number){

    
    this.solicitudService.obtenerVacacionParaImpresion(solicitudVacacionId)
    .then((data) => {
      this.reporteEsVisible = true;
      this.vacacion = data;
      this.cerrarPopup();
    })
    .catch(() => this.cerrarPopup())
  }

  async imprimir2(solicitudVacacionId: number) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Alerts.warning('Advertencia', 'El navegador bloqueó la ventana emergente del PDF.');
      return;
    }

    Alerts.openLoad();

    try {
      this.vacacion = await this.solicitudService.obtenerVacacionParaImpresion(solicitudVacacionId);
      this.cdr.detectChanges();
      await this.waitForViewRender();
      await this.waitForImages(this.pdfContainer.nativeElement);

      if (!this.pdfContainer?.nativeElement) {
        throw new Error('No se encontró el contenedor para exportar PDF.');
      }

      const documentElement = this.pdfContainer.nativeElement.querySelector('#documento') as HTMLElement;
      if (!documentElement) {
        throw new Error('No se encontró el contenido del documento para exportar PDF.');
      }

      const group: Group = await drawDOM(documentElement, {
        paperSize: 'Letter',
        margin: {
          top: '0.2cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        },
        scale: 0.6
      });

      const pdfDataUri = await exportPDF(group);
      const pdfBlob = await fetch(pdfDataUri).then((response) => response.blob());
      const objectUrl = URL.createObjectURL(pdfBlob);

      printWindow.location.href = objectUrl;
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      Alerts.closeLoad();
    } catch (error) {
      printWindow.close();
      Alerts.closeLoad();
      Alerts.error('Error', 'No se pudo generar el PDF para impresión.');
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
        setTimeout(done, 3000);
      });
    }));
  }

}
