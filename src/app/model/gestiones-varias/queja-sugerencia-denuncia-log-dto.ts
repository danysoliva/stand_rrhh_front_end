/** Respuesta del API para filas de historial de quejas (audit_log proyectado a este contrato). */
export class QuejaSugerenciaDenunciaLogDto {
  id = 0;
  quejaSugerenciaDenunciaId = 0;
  /** Fecha/hora local de negocio (string ISO o Date para el grid). */
  fechaHora?: string | Date;
  accion = '';
  estadoAnteriorId?: number;
  estadoNuevoId?: number;
  /** Id del actor (empleado); el API puede enviarlo como `usuarioId` o `idUser`. */
  usuarioId?: number;
  idUser?: number;
  /** Nombre del empleado cuando el API lo incluye (join). */
  usuarioNombre?: string;
  detalle?: string;
}
