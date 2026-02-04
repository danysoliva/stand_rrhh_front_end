import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NuevaSolicitudConstanciaDto, SolicitudConstanciaDto, TipoSolicitudEnum } from '../model/solicitud/solicitud-constancia-dto';
import { CambioEstadoSolicitudDto } from '../model/solicitud/cambio-estado-solicitud-dto';
import { NuevaSolicitudVacacionDto, SolicitudVacacionDto } from '../model/solicitud/solicitud-vacacion-dto';
import { ConstanciaTrabajoDocDto } from '../pages/app-rrhh/documentos/models/constancia-trabajo-doc-dto';
import { VacacionDocDto } from '../pages/app-rrhh/documentos/models/vacacion-doc-dto';
import { ValidarVacacionDto } from '../model/solicitud/validar-vacacion-dto';
import { ConceptoDto } from '../model/solicitud/concepto-dto';
import { TipoVacacionDto } from '../model/solicitud/tipo-vacacion-dto';
import { VacacionDocNewFormatDto } from '../pages/app-rrhh/documentos/models/vacacion-doc-new-format-dto';


@Injectable()
export class SolicitudService {

  constructor(private httpClient: HttpClient) {
  }

  baseUrl = `${environment.rrhh_api}solicitud/`
  
  obtenerConceptosConfigurables(): Promise<ConceptoDto[]> {
    const uri = `${this.baseUrl}obtenerConceptosConfigurables`;
    return this.httpClient.get<ConceptoDto[]>(uri).toPromise();
  }

  obtenerSolicitudesDeConstanciasPorEmpleadoId(): Promise<SolicitudConstanciaDto[]> {
    const uri = `${this.baseUrl}obtenerSolicitudesDeConstanciasPorEmpleadoId`;
    return this.httpClient.get<SolicitudConstanciaDto[]>(uri).toPromise();
  }

  guardarSolicitudDeConstancia(nuevaSolicitudConstancia: NuevaSolicitudConstanciaDto): Promise<SolicitudConstanciaDto[]> {
    const uri = `${this.baseUrl}guardarSolicitudDeConstancia`;
    return this.httpClient.post<SolicitudConstanciaDto[]>(uri, nuevaSolicitudConstancia).toPromise();
  }

  eliminarSolicitudDeConstancia(solicitudId: number): Promise<SolicitudConstanciaDto[]> {
    const uri = `${this.baseUrl}eliminarSolicitudDeConstancia`;
    return this.httpClient.post<SolicitudConstanciaDto[]>(uri, solicitudId).toPromise();
  }

  obtenerSolicitudesDeConstanciasPorEstadoIdParaRRHH(estadoId:number): Promise<SolicitudConstanciaDto[]> {
    const uri = `${this.baseUrl}obtenerSolicitudesDeConstanciasPorEstadoIdParaRRHH?estadoId=${estadoId}`;
    return this.httpClient.get<SolicitudConstanciaDto[]>(uri).toPromise();
  }

  cambiarEstadoSolicitudConstancia(cambioEstadoSolicitud: CambioEstadoSolicitudDto): Promise<SolicitudConstanciaDto[]> {
    const uri = `${this.baseUrl}cambiarEstadoSolicitudConstancia`;
    return this.httpClient.post<SolicitudConstanciaDto[]>(uri, cambioEstadoSolicitud).toPromise();
  }

  obtenerConstanciaParaImpresion(solicitudConstanciaId: number): Promise<ConstanciaTrabajoDocDto>{
    const uri = `${this.baseUrl}obtenerConstanciaParaImpresion?solicitudConstanciaId=${solicitudConstanciaId}`;
    return this.httpClient.get<ConstanciaTrabajoDocDto>(uri).toPromise();
  }



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

  obtenerSolicitudesDeVacacionPorEstadoIdParaRRHH(estadoId:number): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}obtenerSolicitudesDeVacacionPorEstadoIdParaRRHH?estadoId=${estadoId}`;
    return this.httpClient.get<SolicitudVacacionDto[]>(uri).toPromise();
  }

  cambiarEstadoSolicitudDeVacacion(cambioEstadoSolicitud: CambioEstadoSolicitudDto): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}cambiarEstadoSolicitudDeVacacion`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, cambioEstadoSolicitud).toPromise();
  }

  obtenerVacacionParaImpresion(solicitudVacacionId: number): Promise<VacacionDocNewFormatDto>{
    const uri = `${this.baseUrl}obtenerVacacionParaImpresion?solicitudVacacionId=${solicitudVacacionId}`;
    return this.httpClient.get<VacacionDocNewFormatDto>(uri).toPromise();
  }

  sincronizarVacacionEnOdoo(solicitudId: number): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}sincronizarVacacionEnOdoo`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, solicitudId).toPromise();
  }


  eliminarSolicitudComoAdministrador(solicitudId: number): Promise<SolicitudVacacionDto[]> {
    const uri = `${this.baseUrl}eliminarSolicitudDeVacacionComoAdministrador`;
    return this.httpClient.post<SolicitudVacacionDto[]>(uri, solicitudId).toPromise();
  }

  obtenerDiasPendientesDeVacacion(): Promise<number> {
    const uri = `${this.baseUrl}ObtenerDiasPendientesDeVacacion`;
    return this.httpClient.get<number>(uri).toPromise();
  }

  ObtenerTipoVacaciones(): Promise<TipoVacacionDto[]> {
    const uri = `${this.baseUrl}obtenerTipoVacaciones`;
    return this.httpClient.get<TipoVacacionDto[]>(uri).toPromise();
  }


}
