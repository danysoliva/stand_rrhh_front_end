export class QuejaSugerenciaDenunciaLogCreateDto {
  quejaSugerenciaDenunciaId: number = 0;
  accion: string = '';
  estadoAnteriorId?: number;
  estadoNuevoId?: number;
  usuarioId?: number;
  detalle?: string;
}
