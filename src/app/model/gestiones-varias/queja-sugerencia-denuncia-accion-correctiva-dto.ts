import { QuejaSugerenciaDenunciaEvidenciaAccionDto } from './queja-sugerencia-denuncia-evidencia-accion-dto';

export class QuejaSugerenciaDenunciaAccionCorrectivaDto {
  id: number;
  idQuejaSugerenciaDenuncia: number;
  descripcionAccion: string;
  fechaImplementacion: string | Date;
  idUsuarioResponsable?: number;
  evidencias: QuejaSugerenciaDenunciaEvidenciaAccionDto[] = [];
}
