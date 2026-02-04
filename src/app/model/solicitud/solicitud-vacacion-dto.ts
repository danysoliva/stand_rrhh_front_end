import { TipoVacacionDto } from "./tipo-vacacion-dto"

export class SolicitudVacacionDto {
    id: number
    cantidadDiasVacacion: number
    fechaInicio: Date
    fechaFin: Date
    fechaReintegro: Date
    cubreVacaciones: string
    observaciones: string
    employeeId: number
    employee: string
    jefeInmediatoId: number
    jefeInmediato: string
    mailJefeInmediato: string
    requestStateId: number
    requestState: string
    comment: string
    createdDate: Date
    esVistaRRHHAdministrador: boolean
    esVistaJefatura: boolean
}

export class NuevaSolicitudVacacionDto {
    cantidadDiasVacacion: number
    fechaInicio: Date
    fechaFin: Date
    fechaReintegro: Date
    cubreVacaciones: string
    observaciones: string
    actividadesPendientes: string
    tipoVacacion:TipoVacacionDto[]
}        
