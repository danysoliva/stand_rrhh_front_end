import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CambioEstadoSolicitudDto } from '../model/solicitud/cambio-estado-solicitud-dto';
import { NuevaSolicitudVacacionDto, SolicitudVacacionDto } from '../model/solicitud/solicitud-vacacion-dto';
import { VacacionDocDto } from '../pages/app-rrhh/documentos/models/vacacion-doc-dto';
import { ValidarVacacionDto } from '../model/solicitud/validar-vacacion-dto';

@Injectable()
export class SolicitudVacacionService {

  constructor(private httpClient: HttpClient) {
  }

  baseUrl = `${environment.rrhh_api}solicitudVacacion/`

  obtenerSolicitudesDeVacacionesPorEmpleadoId(): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}obtenerSolicitudesDeVacacionesPorEmpleadoId`;
    return this.httpClient.get<SolicitudVacacionDto[]>(uri).toPromise();
  }

  validarFechasVacacion(validarVacacionDto: ValidarVacacionDto): Promise<ValidarVacacionDto> {
    const uri = `${this.baseUrl}validarFechasVacacion`;
    return this.httpClient.post<ValidarVacacionDto>(uri, validarVacacionDto).toPromise();
  }

  guardarSolicitudDeVacacion(nuevaSolicitudVacacion: NuevaSolicitudVacacionDto): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}guardarSolicitudDeVacacion`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, nuevaSolicitudVacacion).toPromise();
  }

  eliminarSolicitudDeVacacion(solicitudId: number): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}eliminarSolicitudDeVacacion`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, solicitudId).toPromise();
  }

  obtenerSolicitudesDeVacacionPorEstadoIdParaRRHH(): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}obtenerSolicitudesDeVacacionPorEstadoIdParaRRHH`;
    return this.httpClient.get<SolicitudVacacionDto[]>(uri).toPromise();
  }

  cambiarEstadoSolicitudDeVacacion(cambioEstadoSolicitud: CambioEstadoSolicitudDto): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}cambiarEstadoSolicitudDeVacacion`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, cambioEstadoSolicitud).toPromise();
  }

  obtenerVacacionParaImpresion(solicitudVacacionId: number): Promise<VacacionDocDto>{
    const uri = `${this.baseUrl}obtenerVacacionParaImpresion?solicitudVacacionId=${solicitudVacacionId}`;
    return this.httpClient.get<VacacionDocDto>(uri).toPromise();
  }
}
