import { NbComponentStatus } from '@nebular/theme';

/** Etiquetas de rrhh_web.request_state (respaldo si el API no envía el nombre). */
const REQUEST_STATE_LABELS: Record<number, string> = {
  1: 'En Proceso',
  2: 'Aprobado',
  3: 'Denegado',
  4: 'Aprobado por Jefe Inmediato',
  5: 'Rechazado por Jefe Inmediato',
  6: 'Aprobado por RRHH',
  7: 'Rechazado por RRHH',
};

/** Descripción legible del estado para historial de constancias. */
export function textoEstadoSolicitud(estadoId?: number | null, nombreDesdeApi?: string | null): string {
  if (nombreDesdeApi != null && String(nombreDesdeApi).trim() !== '') {
    return nombreDesdeApi;
  }
  if (estadoId == null || estadoId === undefined) {
    return '—';
  }
  return REQUEST_STATE_LABELS[estadoId] ?? `#${estadoId}`;
}

export type IconoEstadoSolicitud = { icon: string; status: NbComponentStatus };

/** Icono Eva + color Nebular según id o nombre de estado (request_state). */
export function iconoEstadoSolicitud(
  estadoId?: number | null,
  nombreEstado?: string | null
): IconoEstadoSolicitud {
  if (estadoId != null) {
    switch (estadoId) {
      case 1:
        return { icon: 'clock-outline', status: 'warning' };
      case 2:
        return { icon: 'checkmark-circle-outline', status: 'success' };
      case 3:
        return { icon: 'close-circle-outline', status: 'danger' };
      case 4:
        return { icon: 'person-done-outline', status: 'success' };
      case 5:
        return { icon: 'person-remove-outline', status: 'danger' };
      case 6:
        return { icon: 'checkmark-circle-2-outline', status: 'success' };
      case 7:
        return { icon: 'close-circle-outline', status: 'danger' };
    }
  }

  const norm = (nombreEstado ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (norm.includes('rechaz') || norm.includes('deneg')) {
    return { icon: 'close-circle-outline', status: 'danger' };
  }
  if (norm.includes('aprob')) {
    return { icon: 'checkmark-circle-outline', status: 'success' };
  }
  if (norm.includes('proceso')) {
    return { icon: 'clock-outline', status: 'warning' };
  }
  return { icon: 'radio-button-on-outline', status: 'basic' };
}
