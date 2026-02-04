import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PerfilEmpleadoDto } from '../model/maestro/perfil-empleado-dto';
import { NominaEncabezadoDto } from '../model/maestro/nomina-encabezado-dto';
import { VoucherDto } from '../model/maestro/voucher-dto';
import { RepositorioImagenesDto } from '../model/maestro/repositorio-imagenes-dto';
import { HoraEmpleadoDto } from '../model/maestro/hora-empleado-dto';
import { RangoFechaHorasEmpleadoParamsDto } from '../model/maestro/rango-fecha-horas-empleado-param-dto';
import { VoucherDocDto } from '../pages/app-rrhh/documentos/models/voucher-doc-dto';
import { RolUsuarioDto } from '../model/maestro/rol-usuario-dto';
import { RolUsuarioParamsDto } from '../model/maestro/rol-usuario-params-dto';
import { DepartmentDto } from '../model/gestiones-varias/department-dto';
import { CambiarPinDto } from '../model/maestro/cambiar-pin-dto';
import { VoucherResponseDto } from '../model/maestro/voucher-response-dto';


@Injectable()
export class MaestroService {

  constructor(private httpClient: HttpClient) {
  }

  baseUrl = `${environment.rrhh_api}maestro/`


  obtenerPerfilEmpleado(): Promise<PerfilEmpleadoDto> {
    const uri = `${this.baseUrl}getEmployeeProfile`
    return this.httpClient.get<PerfilEmpleadoDto>(uri).toPromise()
  }


  obtenerNominaEncabezado(){
    const uri = `${this.baseUrl}getNominaEncabezado`
    return this.httpClient.post<NominaEncabezadoDto[]>(uri,NominaEncabezadoDto).toPromise();
  }


  obtenerVoucher(payslipRunId:number):Promise<VoucherResponseDto>{
    const uri = `${this.baseUrl}getVoucher?payslipRunId=${payslipRunId}`
    return this.httpClient.get<VoucherResponseDto>(uri).toPromise();
  }


  getDetalleHorariosEmpleados(horaEmpleadoParams: RangoFechaHorasEmpleadoParamsDto): Promise<HoraEmpleadoDto[]> {
    const uri = `${this.baseUrl}getDetalleHorasEmpleado`
    return this.httpClient.post<HoraEmpleadoDto[]>(uri,horaEmpleadoParams).toPromise()
  }

  obtenerRoles():Promise<RolUsuarioDto[]>{
    const uri = `${this.baseUrl}obtenerRolesUsuarios`
    return this.httpClient.get<RolUsuarioDto[]>(uri).toPromise();
  }

  cambiarRolUsuario(rolUsuarioParam:RolUsuarioParamsDto):Promise<Boolean>{
    const uri = `${this.baseUrl}cambiarRolUsuario`
    return this.httpClient.post<Boolean>(uri,rolUsuarioParam).toPromise();
  }

  cambiarPIN(cambiarPinDto:CambiarPinDto):Promise<Boolean>{
    const uri = `${this.baseUrl}cambiarPIN`
    return this.httpClient.post<Boolean>(uri, cambiarPinDto).toPromise();
  }

  cambiarPinDeEmpleado(cambiarPin:CambiarPinDto):Promise<Boolean>{
    const uri = `${this.baseUrl}cambiarPinDeEmpleado`
    return this.httpClient.post<Boolean>(uri, cambiarPin).toPromise();
  }


  sendVoucher(payslipRunId:number):Promise<boolean>{
    const uri = `${this.baseUrl}sendVoucher?payslipRunId=${payslipRunId}`
    return this.httpClient.get<boolean>(uri).toPromise();
  }

 


}
