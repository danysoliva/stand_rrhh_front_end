import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
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

@Component({
  selector: "ngx-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"],
})


export class PerfilComponent implements OnInit {

  baseURL:string;

  constructor(
    private maestroService: MaestroService,
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private emailService: EmailService
  ) {
    this.baseURL = `${environment.rrhh_api}employee/`
  }



  perfil: PerfilEmpleadoDto = new PerfilEmpleadoDto();

  nominasEncabezado: NominaEncabezadoDto[];

  searchModeOption = "contains";

  searchExprOption: any = "name";

  searchTimeoutOption = 200;

  minSearchLengthOption = 0;

  showDataBeforeSearchOption = false;
  popupVisible: boolean = false;
  popupVisibleDE: boolean = false;

  reporteEsVisible: boolean;
  reporteVoucerHorasExtrasEsVisible: boolean;
  reporteDetalleHorasEsVisible: boolean;

  filename = "Voucher";
  filenameHE = "Voucher-HorasExtras";
  filenameDE = "DetalleHoras";

  voucher: VoucherDocDto;
  voucherHorasExtras: VoucherHorasExtrasDocDto;

  abrirPopup = () => {
    this.popupVisible = true;
  };

  abrirPopupDetalleHoras = () => {
    this.reporteDetalleHorasEsVisible = true;
  };

  detalleHorasEmpleado: HoraEmpleadoDto[];
  now: Date = new Date();

  planilla: UntypedFormControl = new UntypedFormControl(null, Validators.required);

  rangoFechasForm = this.fb.group({
    fechai: [new Date(), Validators.required],
    fechaf: [new Date(), Validators.required],
  });

  ngOnInit(): void {
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
      this.nominasEncabezado = data;
    });
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


  enviarVoucher() {
    this.maestroService
      .sendVoucher(this.planilla.value)
      .then((data) => {
        Alerts.success("Exito","El mensaje se ha enviado exitosamente")
      })
      
  }

  filtrar() {
    let horaEmpleadoParams = {
      fechaInicio: this.datePipe.transform(
        this.rangoFechasForm.value.fechai,
        "yyyy-MM-dd"
      ),
      fechaFin: this.datePipe.transform(
        this.rangoFechasForm.value.fechaf,
        "yyyy/MM/dd"
      ),
      employeeId: 1,
    };

    this.maestroService
      .getDetalleHorariosEmpleados(horaEmpleadoParams)
      .then((data) => {
        this.detalleHorasEmpleado = data;
      });
  }

  enviar() {
    let horaEmpleadoParams = {
      fechaInicio: this.datePipe.transform(
        this.rangoFechasForm.value.fechai,
        "yyyy-MM-dd"
      ),
      fechaFin: this.datePipe.transform(
        this.rangoFechasForm.value.fechaf,
        "yyyy/MM/dd"
      ),
      employeeId: 0,
    };

    this.emailService
      .EnviarDetalleHorasPorEmpleado(horaEmpleadoParams)
      .then((data) => {
        Alerts.success("Confirmación", "Se ha enviado el correo con exito");
      });
  }

  print() {
    if (this.detalleHorasEmpleado!=undefined &&  this.detalleHorasEmpleado.length>=1 ) {
      this.abrirPopupDetalleHoras();
    } else {
      Alerts.error('Error','No hay registros qué imprimir')
    }
    console.log(this.detalleHorasEmpleado);
    
  }
}
