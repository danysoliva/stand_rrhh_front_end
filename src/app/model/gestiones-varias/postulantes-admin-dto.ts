
export class PostulantesAdminDto {
    id: number;
    plazaVacanteId: number;
    nombre: string;
    correo: string;
    telefono: string;
    recomendadoOInterno: string;
    adjuntos: AdjuntosPostulante[];
}

export class AdjuntosPostulante {
    uRL: string;
    fileNameReference: string;
}