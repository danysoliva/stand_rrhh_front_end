import { Injectable } from '@angular/core';

@Injectable()
export class RepositorioDocumentoDto {
    id: number;
    host: string;
    path: string;
    fileName: string;
    fullPath: string;
    referenceFileName: string;  
    grupoId: number;
    grupoDocumento: string;  
}

export enum TipoRepositorioEnum{
    Formatos = 1,
    Politicas = 2
}