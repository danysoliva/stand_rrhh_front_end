import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { EnviarDetalleHorasParamsDto } from "../model/email/enviar-detalle-horas-params-dto";

@Injectable()
export class EmailService {

    constructor(private httpClient: HttpClient) {
    }

    baseUrl = `${environment.rrhh_api}email/`


    EnviarDetalleHorasPorEmpleado(horaEmpleadoParams: EnviarDetalleHorasParamsDto): Promise<boolean> {
        const uri = `${this.baseUrl}enviarDetalleHorasPorEmpleado`
        return this.httpClient.post<boolean>(uri,horaEmpleadoParams).toPromise()
      }
}