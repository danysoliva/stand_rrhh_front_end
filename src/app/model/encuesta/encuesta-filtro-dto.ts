import { EncuestaEstadoFiltroDto } from "./encuesta-estado-filtro-dto";
import { EncuestaNameFiltroDto } from "./encuesta-name-filtro-dto";

export class EncuestaFiltroDto {
    estados: EncuestaEstadoFiltroDto[];
    encuestas: EncuestaNameFiltroDto[];
}