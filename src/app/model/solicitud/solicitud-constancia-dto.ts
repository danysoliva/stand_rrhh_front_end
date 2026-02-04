export class SolicitudConstanciaDto {
    id: number
    employeeId: number
    employeeName: string
    requestTypeId: number
    requestType: string
    requestStateId: number
    requestState: string
    comment: string
    createdDate: Date
    esVistaRRHHAdministrador: boolean;    
}

export class NuevaSolicitudConstanciaDto {
    tipoConstanciaId: number;
} 

export enum TipoSolicitudEnum{
    ConstanciaTrabajoConAnexos = 1,
    ConstanciaTrabajoSinAnexos = 2
}
