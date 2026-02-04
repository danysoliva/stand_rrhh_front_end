export enum AccionEnum {
    Aprobar = 1,
    Denegar = 2,
}

export enum EstadoSolicitudEnum {
    EnProceso = 1,
    Aprobado = 2,
    Denegado = 3,
    AprobadoPorJefeInmediato = 4,
    RechazadoPorJefeInmediato = 5,
    AprobadoPorRRHH = 6,
    RechazadoPorRRHH = 7
}

export enum UserLevelEnum {
    Administrador = 1,
    Usuario = 2
}

export enum TipoAutorizacionEnum {
    Jefatura = 1,
    RecursosHumanos = 2    
}