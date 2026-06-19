import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { QuejaSugerenciaDenunciaAccionCorrectivaCreateDto } from '../model/gestiones-varias/queja-sugerencia-denuncia-accion-correctiva-create-dto';
import { QuejaSugerenciaDenunciaAccionCorrectivaDto } from '../model/gestiones-varias/queja-sugerencia-denuncia-accion-correctiva-dto';

@Injectable()
export class QuejasDenunciasSugerenciasService {
  baseUrl = `${environment.rrhh_api}QuejasDenunciasSugerencias/`;

  constructor(private httpClient: HttpClient) {}

  guardarAccionCorrectivaYCompletar(
    dto: QuejaSugerenciaDenunciaAccionCorrectivaCreateDto,
    archivos: File[],
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append('dto', JSON.stringify(dto));
    archivos.forEach((archivo) => formData.append('files', archivo, archivo.name));
    const uri = `${this.baseUrl}guardarAccionCorrectivaYCompletar`;
    return this.httpClient.post<boolean>(uri, formData).toPromise();
  }

  obtenerAccionesCorrectivas(idQueja: number): Promise<QuejaSugerenciaDenunciaAccionCorrectivaDto[]> {
    const uri = `${this.baseUrl}obtenerAccionesCorrectivas/${idQueja}`;
    return this.httpClient.get<QuejaSugerenciaDenunciaAccionCorrectivaDto[]>(uri).toPromise();
  }

  descargarEvidencia(idEvidencia: number): Promise<Blob> {
    const uri = `${this.baseUrl}descargarEvidencia/${idEvidencia}`;
    return this.httpClient.get(uri, { responseType: 'blob' }).toPromise();
  }
}
