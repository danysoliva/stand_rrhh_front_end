/** Respuesta del API: filas de rrhh_web.audit_log para solicitudes de constancia. */
export class SolicitudConstanciaLogDto {
  id: number;
  solicitudConstanciaId: number;
  fechaHora: string | Date;
  accion: string;
  estadoAnteriorId?: number;
  estadoAnteriorNombre?: string;
  estadoNuevoId?: number;
  estadoNuevoNombre?: string;
  usuarioId?: number;
  usuarioNombre?: string;
  detalle?: string;
}
