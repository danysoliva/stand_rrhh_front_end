import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { EncuestaAnswerDto } from "../model/encuesta/encuesta-answer-dto";
import { EncuestaDto } from "../model/encuesta/encuesta-dto";
import { EncuestaEstadoFiltroDto } from "../model/encuesta/encuesta-estado-filtro-dto";
import { EncuestaFiltroDto } from "../model/encuesta/encuesta-filtro-dto";
import { EncuestaNameFiltroDto } from "../model/encuesta/encuesta-name-filtro-dto";
import { EncuestaResponseDto } from "../model/encuesta/encuesta-response-dto";
import { EncuestaSaveParamsDto } from "../model/encuesta/encuesta-save-params-dto";
import { EncuestaTabulacionDto } from "../model/encuesta/encuesta-tabulacion-dto";

@Injectable()
export class EncuestaService {
    
    constructor(private httpClient: HttpClient) {
    }

    baseUrl = `${environment.rrhh_api}encuesta/`

    saveEncuestaCreatorborrarImagen(encuesta:EncuestaSaveParamsDto): Promise<boolean> {
        const uri = `${this.baseUrl}saveEncuestaCreator`;
        return this.httpClient.post<boolean>(uri, encuesta).toPromise();
      }

      GetEncuesta(id:number): Promise<EncuestaResponseDto>{
        // debugger;
        const uri = `${this.baseUrl}getEncuesta/${id}`;
        return this.httpClient.get<EncuestaResponseDto>(uri).toPromise();
      }

      GuardarEncuesta(encuesta:EncuestaAnswerDto[]):Promise <boolean> {

        return this.httpClient.post<boolean>(`${this.baseUrl}saveEncuestaComplete`,encuesta).toPromise();
      }

      ObtenerEncuestasActivas(): Promise<EncuestaDto[]> {
        const uri = `${this.baseUrl}obtenerEncuestas`
        return this.httpClient.get<EncuestaDto[]>(uri).toPromise()
      }


      CerarEncuesta(encuestaId:number): Promise<boolean>{
        // debugger;
        const uri = `${this.baseUrl}cerrarEncuesta/${encuestaId}`;
        return this.httpClient.get<boolean>(uri).toPromise();
      }

      ObtenerFiltrosDeEncuestaTabulacion(): Promise<EncuestaFiltroDto>{
        const uri = `${this.baseUrl}obtenerFiltrosEncuestas`;
        return this.httpClient.get<EncuestaFiltroDto>(uri).toPromise();
      }


      ObtenerEncuestasFiltradasPorEstado(estadoId:number): Promise<EncuestaNameFiltroDto[]>{
        // debugger;
        const uri = `${this.baseUrl}obtenerEncuestasFiltradasPorEstado/${estadoId}`;
        return this.httpClient.get<EncuestaNameFiltroDto[]>(uri).toPromise();
      }

      

      ObtenerEncuestaPivot(estadoId:number): Promise<EncuestaTabulacionDto[]>{
        // debugger;
        const uri = `${this.baseUrl}obtenerEncuestaTabulacion/${estadoId}`;
        return this.httpClient.get<EncuestaTabulacionDto[]>(uri).toPromise();
      }
    
}