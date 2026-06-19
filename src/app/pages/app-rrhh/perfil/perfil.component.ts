import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { drawDOM, exportPDF, Group } from '@progress/kendo-drawing';
import Swal from 'sweetalert2';
import { HoraEmpleadoDto } from '../../../model/maestro/hora-empleado-dto';
import { NominaEncabezadoDto } from '../../../model/maestro/nomina-encabezado-dto';
import { PerfilEmpleadoDto } from '../../../model/maestro/perfil-empleado-dto';
import { VoucherHorasExtasDto } from '../../../model/maestro/voucher-horas-extras-dto';
import { EmailService } from '../../../servicio/email.service';
import { MaestroService } from '../../../servicio/maestro.service';
import { Alerts } from '../../../_common/utils/alerts';
import { VoucherDocDto } from '../documentos/models/voucher-doc-dto';
import { VoucherHorasExtrasDocDto } from '../documentos/models/voucher-horas-extras-doc-dto';
import { environment } from '../../../../environments/environment';
import { RangoFechaHorasEmpleadoParamsDto } from '../../../model/maestro/rango-fecha-horas-empleado-param-dto';
import { VoucherDecimoTercerMesRequestDto } from '../../../model/maestro/VoucherDecimoTercerMesRequestDto';
import {
  DecimoTercerMesDetalleResponseDto,
  VoucherDecimoTercerMesResponseDto,
} from '../../../model/maestro/VoucherDecimoTercerMesResponseDto';
import { VoucherResponseDto } from '../../../model/maestro/voucher-response-dto';
import { Router } from '@angular/router';
import { LoginDto } from '../../../model/login/login-dto';

/** Tipo de plantilla oculta usada al exportar el PDF del voucher. */
type PdfVoucherKind = 'normal' | 'decimo' | 'horasExtras';

@Component({
  selector: "ngx-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"],
})


export class PerfilComponent implements OnInit {
  @ViewChild('pdfVoucherNewContainer') pdfVoucherNewContainer!: ElementRef<HTMLDivElement>;

  baseURL:string;

  constructor(
    private maestroService: MaestroService,
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef,
     private router: Router,
  ) {
    this.baseURL = `${environment.rrhh_api}employee/`
  }
  
  
  datosUsuario: LoginDto = new LoginDto();

  perfil: PerfilEmpleadoDto = new PerfilEmpleadoDto();

  nominasEncabezado: NominaEncabezadoDto[] = [];

  searchModeOption = "contains";

  searchExprOption: any = "name";

  searchTimeoutOption = 200;

  minSearchLengthOption = 0;

  showDataBeforeSearchOption = false;
  popupVisible: boolean = false;
  popupVisibleDE: boolean = false;

  reporteEsVisible: boolean= false;
  reporteVoucerHorasExtrasEsVisible: boolean = false;
  reporteDetalleHorasEsVisible: boolean = false;

  filename = "Voucher";
  filenameHE = "Voucher-HorasExtras";
  filenameDE = "DetalleHoras";

  voucher: VoucherDocDto = new VoucherDocDto();
  voucherNew: VoucherDocDto = new VoucherDocDto();
  /** Respuesta de `getVoucherDecimoTercerMes` para `DocVoucherDecimoTercerMesComponent`. */
  voucherDecimoTercerMes: VoucherDecimoTercerMesResponseDto = new VoucherDecimoTercerMesResponseDto();
  voucherHorasExtras: VoucherHorasExtrasDocDto = new VoucherHorasExtrasDocDto();

  /** Qué componente de documento se renderiza antes del `drawDOM`. */
  pdfVoucherKind: PdfVoucherKind = 'normal';

  abrirPopup = () => {
    this.popupVisible = true;
  };

  abrirPopupDetalleHoras = () => {
    this.reporteDetalleHorasEsVisible = true;
  };

  detalleHorasEmpleado: HoraEmpleadoDto[] = [];
  now: Date = new Date();

  planilla: UntypedFormControl = new UntypedFormControl(null, Validators.required);

  /** Elemento completo elegido en el SelectBox (además del `id` en `planilla.value`). */
  nominaEncabezadoSeleccionada: NominaEncabezadoDto | null = null;

  rangoFechasForm = this.fb.group({
    fechai: [new Date(), Validators.required],
    fechaf: [new Date(), Validators.required],
  });

  ngOnInit(): void {

    this.datosUsuario = JSON.parse(localStorage.getItem('Auth' ) || '{}') as LoginDto;

    if (this.datosUsuario == undefined) {
      this.router.navigate(['/auth']);
    }
    
    this.maestroService
      .obtenerPerfilEmpleado()
      .then((data) => {
        this.perfil = data;
        this.perfil.pictureProfile = this.baseURL+ "picture/"+this.perfil.id;
 
        
      })
      .catch((p) => {
        Alerts.error("Error", p.message.error);
      });

    this.maestroService.obtenerNominaEncabezado().then((data) => {
      this.nominasEncabezado = (data ?? []).map((row) =>
        this.normalizeNominaEncabezadoRow(row as NominaEncabezadoDto & Record<string, unknown>)
      );
    });
  }

  /**
   * Con `valueExpr="id"`, el FormControl `planilla` solo guarda el id.
   * Aquí resuelves el registro completo del arreglo para usar `name`, `paySlipId`, etc.
   */
  onNominaEncabezadoChanged(e: { value: number | null }): void {
    const id = e?.value;
 
    if (id == null) {
      this.nominaEncabezadoSeleccionada = null;
      return;
    }
    this.nominaEncabezadoSeleccionada =
      this.nominasEncabezado.find((n) => n.id === id) ?? null;
  }

  solicitarPlanilla() {
    this.maestroService
      .obtenerVoucher(this.planilla.value)
      .then((data) => {
        if (data.payRolTypeId == 3 /*Es el Id de Horas extras*/) {
          this.reporteVoucerHorasExtrasEsVisible = true;
          this.voucherHorasExtras = data.voucherHorasExtas;
        } else {
          this.reporteEsVisible = true;
          this.voucher = data.voucher;
        }
      })
      .catch((msj) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: msj.error.message,
        });
        // console.log(msj.error.message);
      });
  }

  async solicitarPlanillaVoucherNew() {
    if (!this.planilla.value) {
      Alerts.warning('Advertencia', 'Seleccione una planilla.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Alerts.warning('Advertencia', 'El navegador bloqueó la ventana emergente del PDF.');
      return;
    }

    Alerts.openLoad();

    try {
      this.syncNominaSeleccionadaConPlanilla();

      const nominaFila =
        this.nominaEncabezadoSeleccionada ??
        this.nominasEncabezado.find((n) => n.id === this.planilla.value) ??
        null;

        console.log('Nomina seleccionada:', nominaFila);

      const payrollFromNomina = nominaFila?.payrollTypeId ?? 0;
      /** Décimo 4/5: solo `getVoucherDecimoTercerMes`, sin `getVoucher`. */
      
      const esDecimoPorNomina = payrollFromNomina === 4 || payrollFromNomina === 5 || payrollFromNomina === 6;

      let meta: VoucherResponseDto | undefined;
      if (!esDecimoPorNomina) {
        meta = await this.maestroService.obtenerVoucher(this.planilla.value);
      }

  
      const payRolTypeId = esDecimoPorNomina
        ? payrollFromNomina
        : (meta?.payRolTypeId ?? payrollFromNomina);

        console.log('payRolTypeId resuelto:', payRolTypeId);

      if (payRolTypeId === 3) {
        this.pdfVoucherKind = 'horasExtras';
        this.voucherHorasExtras = meta!.voucherHorasExtas as unknown as VoucherHorasExtrasDocDto;
      } 
      else if (payRolTypeId === 4 || payRolTypeId === 5 || payRolTypeId === 6) {
        let paySlipId = this.resolvePaySlipIdParaDecimo(nominaFila, meta);
        if (!paySlipId) {
          const metaSlip = meta ?? (await this.maestroService.obtenerVoucher(this.planilla.value));
          paySlipId = metaSlip.voucher?.id ?? 0;
        }

        const req = new VoucherDecimoTercerMesRequestDto();
        req.payrollTypeId = payRolTypeId;
        req.paySlipRunId = this.planilla.value;
        req.paySlipId = paySlipId;
        req.employeeId = this.perfil?.id ?? 0;

        const decimo = await this.maestroService.obtenerVoucherDecimoTercerMes(req);
        this.voucherDecimoTercerMes = this.assignDecimoTercerMesResponse(decimo);
        
        this.pdfVoucherKind = 'decimo';
      } 
      else {
        this.pdfVoucherKind = 'normal';
        if (!meta) {
          meta = await this.maestroService.obtenerVoucher(this.planilla.value);
        }
        const v = meta.voucher;
        
        this.voucherNew = {
          ...v,
          beneficios: v.beneficios ?? [],
          deducciones: v.deducciones ?? [],
        } as VoucherDocDto;
      }

      this.cdr.detectChanges();
      await this.waitForViewRender();
      await this.inlineImagesAsDataUrls(this.pdfVoucherNewContainer.nativeElement);
      await this.waitForImages(this.pdfVoucherNewContainer.nativeElement);

      const documentElement = this.pdfVoucherNewContainer.nativeElement.querySelector('#documento') as HTMLElement;
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
    } 
    catch (msj: any) {
      printWindow.close();
      Alerts.closeLoad();
      Alerts.error('Error', msj?.error?.message || 'No se pudo generar el PDF para impresión.');
    }
  }


  enviarVoucher() {
    this.maestroService
      .sendVoucher(this.planilla.value)
      .then((data) => {
        Alerts.success("Exito","El mensaje se ha enviado exitosamente")
      })
      
  }

filtrar() {
  const fechaI = this.datePipe.transform(this.rangoFechasForm.value.fechai, "yyyy/MM/dd");
  const fechaF = this.datePipe.transform(this.rangoFechasForm.value.fechaf, "yyyy/MM/dd");

  // Solo ejecutamos si hay fechas válidas
  if (fechaI && fechaF) {
    let horaEmpleadoParams: RangoFechaHorasEmpleadoParamsDto = {
      fechaInicio: fechaI,
      fechaFin: fechaF,
      employeeId: 1,
    };

    this.maestroService
      .getDetalleHorariosEmpleados(horaEmpleadoParams)
      .then((data) => {
        this.detalleHorasEmpleado = data;
      });
  } else {
    console.error("Las fechas no pueden estar vacías");
  }
}

enviar() {
  const horaEmpleadoParams = {
    fechaInicio: this.datePipe.transform(
      this.rangoFechasForm.value.fechai,
      "dd-MM-yyyy"
    ) ?? "",
    fechaFin: this.datePipe.transform(
      this.rangoFechasForm.value.fechaf,
      "dd-MM-yyyy"
    ) ?? "",
    employeeId: 0,
  };

  this.emailService
    .EnviarDetalleHorasPorEmpleado(horaEmpleadoParams)
    .then((data) => {
      Alerts.success("Confirmación", "Se ha enviado el correo con exito");
    });
}

print() {
  const horaEmpleadoParams = {
    fechaInicio: this.datePipe.transform(
      this.rangoFechasForm.value.fechai,
      "dd-MM-yyyy"
    ) ?? "",
    fechaFin: this.datePipe.transform(
      this.rangoFechasForm.value.fechaf,
      "dd-MM-yyyy"
    ) ?? "",
    employeeId: 0,
  };

  this.emailService
    .ImprimirDetalleHoras(horaEmpleadoParams)
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    })
    .catch((err) => {
      Alerts.error("Error", "No se pudo generar el PDF para impresión");
    });
}

/** Alinea la fila seleccionada con el id del formulario por si `onValueChanged` no corrió. */
private syncNominaSeleccionadaConPlanilla(): void {
  const id = this.planilla.value;
  if (id == null) {
    return;
  }
  if (!this.nominaEncabezadoSeleccionada || this.nominaEncabezadoSeleccionada.id !== id) {
    this.nominaEncabezadoSeleccionada =
      this.nominasEncabezado.find((n) => n.id === id) ?? null;
  }
}

/**
 * Unifica nombres de propiedad que a veces vienen del API (`payslipId`, `PaySlipId`, etc.).
 */
private normalizeNominaEncabezadoRow(
  row: NominaEncabezadoDto & Record<string, unknown>
): NominaEncabezadoDto {
  const n = new NominaEncabezadoDto();
  n.id = Number(row.id) || 0;
  n.name = String(row.name ?? '');
  n.createDate = String(row.createDate ?? '');
  n.payrollTypeId = Number(row.payrollTypeId) || 0;
  const slipRaw =
    row.paySlipId ??
    row['payslipId'] ??
    row['PaySlipId'] ??
    row['paySLipId'];
 n.paySlipId = slipRaw != null ? Number(slipRaw) || 0 : 0;
  return n;
}

private resolvePaySlipIdParaDecimo(
  nominaFila: NominaEncabezadoDto | null,
  meta: VoucherResponseDto | undefined
): number {
  const desdeNomina =
    nominaFila?.paySlipId ||
    this.nominaEncabezadoSeleccionada?.paySlipId ||
    0;
  if (desdeNomina) {
    return desdeNomina;
  }
  return meta?.voucher?.id ?? 0;
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
    if (img.complete && img.naturalWidth > 0) {
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

private async inlineImagesAsDataUrls(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];

  await Promise.all(images.map(async (img) => {
    const rawSrc = img.currentSrc || img.src || img.getAttribute('src');
    if (!rawSrc || rawSrc.startsWith('data:')) {
      return;
    }

    try {
      const src = this.toAbsoluteUrl(rawSrc);
      const response = await fetch(src, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('No se pudo descargar la imagen.');
      }

      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);
      img.src = dataUrl;
    } catch {
      // Fallback explícito para el logo institucional.
      if ((rawSrc || '').toLowerCase().includes('aquafeed')) {
        try {
          const fallbackUrl = `${window.location.origin}/assets/images/aquafeed.png`;
          const fallbackResponse = await fetch(fallbackUrl, { cache: 'no-store' });
          if (!fallbackResponse.ok) {
            return;
          }
          const fallbackBlob = await fallbackResponse.blob();
          img.src = await this.blobToDataUrl(fallbackBlob);
        } catch {
          // If fallback also fails, keep original src.
        }
      }
    }
  }));
}

private toAbsoluteUrl(src: string): string {
  if (/^https?:\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  if (src.startsWith('/')) {
    return `${window.location.origin}${src}`;
  }

  return new URL(src, document.baseURI).href;
}

/**
 * Quita envoltorios típicos (`data`, `result`, etc.) hasta llegar al objeto del voucher.
 */
private unwrapDecimoResponse(src: unknown): Record<string, unknown> {
  let r = (src && typeof src === 'object' ? src : {}) as Record<string, unknown>;
  const wraps = ['data', 'Data', 'result', 'Result', 'value', 'Value', 'payload', 'Payload'];
  for (let i = 0; i < 6; i++) {
    const hasScalar =
      r['employeeName'] != null ||
      r['EmployeeName'] != null ||
      r['payslipRunName'] != null ||
      r['PayslipRunName'] != null;
    const hasDetalleKey =
      r['detalle'] != null ||
      r['Detalle'] != null ||
      r['detalles'] != null ||
      r['Detalles'] != null ||
      r['beneficios'] != null ||
      r['Beneficios'] != null;
    if (hasScalar || hasDetalleKey) {
      return r;
    }
    let inner: Record<string, unknown> | null = null;
    for (const w of wraps) {
      const v = r[w];
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        inner = v as Record<string, unknown>;
        break;
      }
    }
    if (!inner) {
      return r;
    }
    r = inner;
  }
  return r;
}

/**
 * Localiza el arreglo de líneas aunque venga con otro nombre o dentro de un envoltorio.
 */
private extractDetalleRows(r: Record<string, unknown>): unknown[] {
  const directKeys = [
    'detalle',
    'Detalle',
    'detalles',
    'Detalles',
    'listaDetalle',
    'ListaDetalle',
    'listaDetalles',
    'ListaDetalles',
    'voucherDetalle',
    'VoucherDetalle',
    'decimoTercerMesDetalle',
    'DecimoTercerMesDetalle',
    'decimoTercerMesDetalles',
    'DecimoTercerMesDetalles',
    'beneficios',
    'Beneficios',
    'lineas',
    'Lineas',
    'detalleLineas',
    'DetalleLineas',
  ];
  for (const k of directKeys) {
    const v = r[k];
    if (Array.isArray(v)) {
      return v;
    }
  }
  for (const w of ['data', 'Data', 'result', 'Result', 'value', 'Value']) {
    const inner = r[w];
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      const nested = this.extractDetalleRows(inner as Record<string, unknown>);
      if (nested.length > 0) {
        return nested;
      }
    }
  }
  return this.findFirstLineItemArray(r);
}

private findFirstLineItemArray(r: Record<string, unknown>): unknown[] {
  for (const k of Object.keys(r)) {
    const v = r[k];
    if (!Array.isArray(v) || v.length === 0) {
      continue;
    }
    const first = v[0];
    if (first == null || typeof first !== 'object' || Array.isArray(first)) {
      continue;
    }
    const o = first as Record<string, unknown>;
    const looksLikeLine =
      'concepto' in o ||
      'Concepto' in o ||
      'valor' in o ||
      'Valor' in o ||
      'monto' in o ||
      'Monto' in o ||
      (('name' in o || 'Name' in o) && ('monto' in o || 'Monto' in o || 'valor' in o || 'Valor' in o));
    if (looksLikeLine) {
      return v;
    }
  }
  return [];
}

/** Normaliza respuesta del API (camelCase o PascalCase típico de .NET). */
private assignDecimoTercerMesResponse(src: unknown): VoucherDecimoTercerMesResponseDto {
  const r = this.unwrapDecimoResponse(src);
  const str = (camel: string, pascal: string) => String(r[camel] ?? r[pascal] ?? '');
  const num = (camel: string, pascal: string) => {
    const v = r[camel] ?? r[pascal];
    return v != null && v !== '' ? Number(v) : 0;
  };
  const out = new VoucherDecimoTercerMesResponseDto();
  out.id = num('id', 'Id');
  out.payslipName = str('payslipName', 'PayslipName');
  out.payslipRunName = str('payslipRunName', 'PayslipRunName');
  out.state = str('state', 'State');
  out.employeeId = num('employeeId', 'EmployeeId');
  out.barCode = str('barCode', 'BarCode');
  out.employeeName = str('employeeName', 'EmployeeName');
  out.employeeDepartment = str('employeeDepartment', 'EmployeeDepartment');
  out.employeeJobName = str('employeeJobName', 'EmployeeJobName');
  out.employeeJournal = str('employeeJournal', 'EmployeeJournal');
  out.identificacion = str('identificacion', 'Identificacion');
  out.dateStart = str('dateStart', 'DateStart');
  out.dateEnd = str('dateEnd', 'DateEnd');
  out.fechaPago = str('fechaPago', 'FechaPago');
  out.moneda = str('moneda', 'Moneda');
  const detRows = this.extractDetalleRows(r);
  out.detalle = [];
  for (const row of detRows) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const d = row as Record<string, unknown>;
    const line = new DecimoTercerMesDetalleResponseDto();
    line.concepto = String(
      d['concepto'] ?? d['Concepto'] ?? d['name'] ?? d['Name'] ?? d['descripcion'] ?? d['Descripcion'] ?? ''
    );
    line.codigo = String(d['codigo'] ?? d['Codigo'] ?? d['code'] ?? d['Code'] ?? '');
    const firstDefinedNumber = (pairs: Array<[string, string]>): number => {
      for (const [c, p] of pairs) {
        if (d[c] !== undefined && d[c] !== null && d[c] !== '') {
          return Number(d[c]);
        }
        if (d[p] !== undefined && d[p] !== null && d[p] !== '') {
          return Number(d[p]);
        }
      }
      return 0;
    };
    const n = (c: string, p: string) => {
      const v = d[c] ?? d[p];
      return v != null && v !== '' ? Number(v) : 0;
    };
    line.valor = firstDefinedNumber([
      ['valor', 'Valor'],
      ['monto', 'Monto'],
      ['amount', 'Amount'],
      ['total', 'Total'],
      ['totalLinea', 'TotalLinea'],
    ]);
    line.orden = n('orden', 'Orden');
    line.cantidad = firstDefinedNumber([
      ['cantidad', 'Cantidad'],
      ['quantity', 'Quantity'],
    ]);
    out.detalle.push(line);
  }
  return out;
}

private blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo convertir imagen a base64.'));
    reader.readAsDataURL(blob);
  });
 }
}
