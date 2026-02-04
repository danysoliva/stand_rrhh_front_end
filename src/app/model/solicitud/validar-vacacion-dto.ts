export class ValidarVacacionDto {
    tipoVerificacion: TipoVerificacionEnum;
    cantidadDiasVacacion: number;
    jornada: number;
    fechaInicio: string;
    fechaFin: string;
    fechaReintegro: string;
}

export enum TipoVerificacionEnum {
    PorFecha = 1,
    PorDias = 2,
    PorJornada = 3        
}