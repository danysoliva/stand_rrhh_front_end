import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { RepositorioImagenesDto } from "../model/maestro/repositorio-imagenes-dto";
import { NoticiaDto } from "../model/uploads/noticia-dto";
import { NoticiasConConfiguracionDto } from "../model/uploads/noticias-con-configuracion-dto";
import { RepositorioDocumentoDto, TipoRepositorioEnum } from "../model/uploads/repositorio-documento-dto";
import { RepositoryGroupDto } from "../model/uploads/repository-group-dto";
import { RepositoryGroupCRUDDto } from "../model/uploads/repository-group-crud-dto";


@Injectable()
export class UploadService {
  constructor(private httpClient: HttpClient) {
  }

  uri = environment.rrhh_api;

  subirArchivos(archivo: File[]): Promise<RepositorioImagenesDto[]> {
    let formData = new FormData();
    archivo.forEach(item => {
      formData.append(item.name, item);
    });

    return this.httpClient.post<RepositorioImagenesDto[]>(`${this.uri}upload`, formData).toPromise();
  }

  getFiles() {
    return this.httpClient.get<NoticiaDto[]>(`${this.uri}getFiles`).toPromise();
  }

  obtenerImagenesNoticias():Promise<NoticiasConConfiguracionDto>{
    const uri = `${this.uri}getImagenesNoticias`
    return this.httpClient.get<NoticiasConConfiguracionDto>(uri).toPromise();
  }

  eliminarImagen(repositoryId: number): Promise<RepositorioImagenesDto[]> {
    return this.httpClient.post<RepositorioImagenesDto[]>(`${this.uri}borrarImagen`, repositoryId).toPromise();
  }

  cambiarDuracionImagen(duracion: number): Promise<Boolean> {
    return this.httpClient.post<Boolean>(`${this.uri}cambiarDuracionImagen`, duracion).toPromise();
  }


  obtenerDocumentos(tipo: TipoRepositorioEnum):Promise<RepositorioDocumentoDto[]>{
    const uri = `${this.uri}getDocuments/${tipo}`
    return this.httpClient.get<RepositorioDocumentoDto[]>(uri).toPromise();
  }


  obtenerDocumentosGrupo():Promise<RepositoryGroupDto[]>{
    const uri = `${this.uri}getDocumentsGroup`
    return this.httpClient.get<RepositoryGroupDto[]>(uri).toPromise();
  }

  subirDocumento(tipo: TipoRepositorioEnum, archivo: File[]): Promise<RepositorioDocumentoDto[]> {
    let formData = new FormData();
    archivo.forEach(item => {
      formData.append(item.name, item);
    });
    return this.httpClient.post<RepositorioDocumentoDto[]>(`${this.uri}uploadDocument/${tipo}`, formData).toPromise();
  }

  subirDocumentoV2(tipo: TipoRepositorioEnum, archivo: File[],id_grupo:number): Promise<RepositorioDocumentoDto[]> {
    let formData = new FormData();
    archivo.forEach(item => {
      formData.append(item.name, item);
    });
    return this.httpClient.post<RepositorioDocumentoDto[]>(`${this.uri}uploadDocument/${tipo}/${id_grupo}`, formData).toPromise();
  }

  eliminarDocumento(tipo: TipoRepositorioEnum, repositoryId: number): Promise<RepositorioDocumentoDto[]> {
    return this.httpClient.post<RepositorioDocumentoDto[]>(`${this.uri}deleteDocument/${tipo}`, repositoryId).toPromise();
  }

  CambiarGrupoDocumento(id_repo: number, id_grupo: number): Promise<RepositorioDocumentoDto[]> {
    return this.httpClient.get<RepositorioDocumentoDto[]>(`${this.uri}changeGroupDocument/${id_repo}/${id_grupo}`).toPromise();
  }

  GrupoCRUD(grupoDto:RepositoryGroupCRUDDto):Promise<Boolean>{
    const uri = `${this.uri}grupoCRUD`
    return this.httpClient.post<Boolean>(uri,grupoDto).toPromise();
  }
  

}
