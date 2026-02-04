import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { DeduccionDto } from "../model/gestiones-varias/deduccion-dto";
import { DepartmentDto } from "../model/gestiones-varias/department-dto";
import { EmpleadoDto } from "../model/gestiones-varias/empleado-dto";
import { ParamsDeduccionPlanillaDto } from "../model/gestiones-varias/params-deduccion-planilla-dto";
import { PlazaDto } from "../model/gestiones-varias/plaza-dto";
import { PlazaVacantePostulanteDto } from "../model/gestiones-varias/plaza-vacante-postulante-dto";
import { PostulantesAdminDto } from "../model/gestiones-varias/postulantes-admin-dto";
import { QuejaSugerenciaDenunciaAdminDto } from "../model/gestiones-varias/queja-sugerencia-denuncia-admin-dto";
import { QuejaSugerenciaDenunciaDto } from "../model/gestiones-varias/queja-sugerencia-denuncia-dto";
import { QuejaSugerenciaDenunciaStateDto } from "../model/gestiones-varias/queja-sugerencia-denuncia-state-dto";
import { QuejaSugerenciaDenunciaTypeDto } from "../model/gestiones-varias/queja-sugerencia-denuncia-type-dto";
import { NominaEncabezadoDto } from "../model/maestro/nomina-encabezado-dto";
import { ParamsChangeStateDto } from "../model/gestiones-varias/paramsChangeState-dto";
import { DeduccionNewFormatDto } from "../model/gestiones-varias/deduccion-new-format-dto";

@Injectable()
export class GestionesVariasService {
  constructor(private httpClient: HttpClient) {}

  baseUrl = `${environment.rrhh_api}GestionesVarias/`;

  obtenerEmpleados(): Promise<EmpleadoDto[]> {
    const uri = `${this.baseUrl}obtenerEmpleados`;
    return this.httpClient.get<EmpleadoDto[]>(uri).toPromise();
  }

  obtenerNominaEncabezado(): Promise<NominaEncabezadoDto[]> {
    const uri = `${this.baseUrl}getNominaEncabezado`;
    return this.httpClient.get<NominaEncabezadoDto[]>(uri).toPromise();
  }

  guardarDeduccion(deduccion: ParamsDeduccionPlanillaDto): Promise<boolean> {
    const uri = `${this.baseUrl}guardarDeduccionPlanilla`;
    return this.httpClient.post<boolean>(uri, deduccion).toPromise();
  }

  obtenerDeducciones(): Promise<DeduccionDto[]> {
    const uri = `${this.baseUrl}obtenerDeducciones`;
    return this.httpClient.get<DeduccionDto[]>(uri).toPromise();
  }

  // imprimirFormatoDeduccionPlanilla(deduccionId: number): Promise<DeduccionDto> {
  //   const uri = `${this.baseUrl}imprimirFormatoDeduccionPlanilla`;
  //   return this.httpClient.post<DeduccionDto>(uri, deduccionId).toPromise();
  // }

  imprimirFormatoDeduccionPlanilla(deduccionId: number): Promise<DeduccionNewFormatDto> {
    const uri = `${this.baseUrl}imprimirFormatoDeduccionPlanilla`;
    return this.httpClient.post<DeduccionNewFormatDto>(uri, deduccionId).toPromise();
  }


  borrarImagen(repositoryId: number): Promise<boolean> {
    const uri = `${this.baseUrl}borrarImagen`;
    return this.httpClient.post<boolean>(uri, repositoryId).toPromise();
  }

  obtenerDepartamentos(): Promise<DepartmentDto[]> {
    const uri = `${this.baseUrl}obtenerDepartamentos`;
    return this.httpClient.get<DepartmentDto[]>(uri).toPromise();
  }

  obtenerPlazas(): Promise<PlazaDto[]> {
    const uri = `${this.baseUrl}obtenerPlazas`;
    return this.httpClient.get<PlazaDto[]>(uri).toPromise();
  }

  guardarPlaza(plaza: PlazaDto): Promise<PlazaDto[]> {
    const uri = `${this.baseUrl}guardarPlaza`;
    return this.httpClient.post<PlazaDto[]>(uri, plaza).toPromise();
  }

  eliminarPlaza(plaza: number): Promise<PlazaDto[]> {
    const uri = `${this.baseUrl}eliminarPlaza`;
    return this.httpClient.post<PlazaDto[]>(uri, plaza).toPromise();
  }


  eliminarDeduccion(deduccioId: number): Promise<DeduccionDto[]> {
    const uri = `${this.baseUrl}eliminarDeduccion`;
    return this.httpClient.post<DeduccionDto[]>(uri, deduccioId).toPromise();
  }

    guardarPostulante( plazaVacantePostulante: PlazaVacantePostulanteDto):Promise<boolean> {
    const uri = `${this.baseUrl}guardarPostulante`;
    return this.httpClient.post<boolean>(uri, plazaVacantePostulante).toPromise();
  }

  getPostulantesByPlazaId(plazaId: number): Promise<PostulantesAdminDto[]> {
    const uri = `${this.baseUrl}getPostulantesByIdPlaza`;
    return this.httpClient.post<PostulantesAdminDto[]>(uri, plazaId).toPromise();
  }

  descartarPostulante(postulanteId: number): Promise<PostulantesAdminDto[]> {
    const uri = `${this.baseUrl}descartarPostulante`;
    return this.httpClient.post<PostulantesAdminDto[]>(uri, postulanteId).toPromise();
  }

  obtenerQuejasSugerenciasDenunciasType(): Promise<QuejaSugerenciaDenunciaTypeDto[]> {
    const uri = `${this.baseUrl}obtenerQuejasSugerenciasDenunciasType`;
    return this.httpClient.get<QuejaSugerenciaDenunciaTypeDto[]>(uri).toPromise();
  }

  obtenerQuejasSugerenciasDenunciasStates(): Promise<QuejaSugerenciaDenunciaStateDto[]> {
    const uri = `${this.baseUrl}obtenerQuejasSugerenciasDenunciasStates`;
    return this.httpClient.get<QuejaSugerenciaDenunciaStateDto[]>(uri).toPromise();
  }

  obtenerQuejasSugerenciasDenuncias(): Promise<QuejaSugerenciaDenunciaAdminDto[]> {
    const uri = `${this.baseUrl}obtenerQuejasSugerenciasDenuncias`;
    return this.httpClient.get<QuejaSugerenciaDenunciaAdminDto[]>(uri).toPromise();
  }
  
  guardarQuejaSugerenciaDenuncia(quejaSugerenciaDenuncia: QuejaSugerenciaDenunciaDto): Promise<boolean> {
    const uri = `${this.baseUrl}guardarQuejaSugerenciaDenuncia`;
    return this.httpClient.post<boolean>(uri, quejaSugerenciaDenuncia).toPromise();
  }

  CambiarEstadoQuejasSugerenciasDenuncia(id:number):Promise <boolean> {

    return this.httpClient.post<boolean>(`${this.baseUrl}cambiarEstadoQuejaSugerenciaDenuncia`,id).toPromise();
  }

  CambiarEstadoQuejasSugerenciasDenunciaManual(idQuejaDenunciaSugerencia:number,estadoId:number): Promise<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}cambiarEstadoQuejaSugerenciaDenunciaManual/${idQuejaDenunciaSugerencia}/${estadoId}`).toPromise();
  }
  
}