import { ConceptoDto } from "./concepto-dto";

export class CambioEstadoSolicitudDto {
    solicitudId: number
    estadoId: number
    comentario: string
    conceptos: ConceptoDto[];
}
