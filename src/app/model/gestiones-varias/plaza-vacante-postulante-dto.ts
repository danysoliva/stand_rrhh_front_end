import { PlazaVacantePostulanteAdjuntoDto } from "./plaza-vacante-postulante-adjunto-dto";

export class PlazaVacantePostulanteDto {
    id: number;
    empleadoId: number;
    nombre: string;
    correo: string;
    telefono: string;
    esRecomendado: boolean;
    plazaVacanteId: number;
    // adjuntos: PlazaVacantePostulanteAdjuntoDto[];
}