import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { QuejaSugerenciaDenunciaAdminDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-admin-dto';
import { QuejaSugerenciaDenunciaLogCreateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-log-create-dto';
import { QuejaSugerenciaDenunciaLogDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-log-dto';
import { GestionesVariasService } from '../../../servicio/gestiones-varias.service';
import { QuejasDenunciasSugerenciasService } from '../../../servicio/quejas-denuncias-sugerencias.service';
import { QuejaSugerenciaDenunciaStateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-state-dto';
import { QuejaSugerenciaDenunciaAccionCorrectivaCreateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-accion-correctiva-create-dto';
import { QuejaSugerenciaDenunciaAccionCorrectivaDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-accion-correctiva-dto';

@Component({
  selector: 'ngx-quejas-sugerencias-denuncias-admin',
  templateUrl: './quejas-sugerencias-denuncias-admin.component.html',
  styleUrls: ['./quejas-sugerencias-denuncias-admin.component.scss']
})
export class QuejasSugerenciasDenunciasAdminComponent implements OnInit {

  constructor(
    private gestionesVariasService: GestionesVariasService,
    private quejasDenunciasSugerenciasService: QuejasDenunciasSugerenciasService,
    private toastr: NbToastrService,
  ) { }

  datos: QuejaSugerenciaDenunciaAdminDto[] = [];
  estados: QuejaSugerenciaDenunciaStateDto[] = [];

  /** Spinner en la tarjeta: carga inicial o operaciones sobre el listado. */
  cargandoContenido = true;

  idElementoSeleccionado: number = 0;
  idEstadoSeleccionado: number = 0  ;
  /** Texto de contexto al abrir “Cambiar estado” (registro, tipo, estado actual). */
  textoContextoCambioEstado: string = '';

  popupVisible: boolean = false;
  popupVisibleCambiarEstado: boolean = false;
  popupAccionCorrectivaVisible = false;
  popupDetalleVisible = false;

  descripcionAccionCorrectiva = '';
  fechaImplementacionAccion: Date = new Date();
  archivosEvidenciaAccion: File[] = [];
  fileUploaderEvidenciaControl: { reset: () => void } | null = null;
  guardandoAccionCorrectiva = false;
  accionesCorrectivasDetalle: QuejaSugerenciaDenunciaAccionCorrectivaDto[] = [];
  cargandoAccionesCorrectivas = false;

  /**
   * Desactiva la animación «pop» del dx-popup de detalle.
   * Con height auto, al montar el grid del historial el popup recalcula alto y parece abrirse dos veces.
   */
  readonly detallePopupSinAnimacion: null = null;

  /** Registro cuyo detalle se muestra en el modal (null al cerrar). */
  registroDetalle: QuejaSugerenciaDenunciaAdminDto | null = null;
  historialLog: QuejaSugerenciaDenunciaLogDto[] = [];
  cargandoLogDetalle = false;
  notaHistorialTexto = '';
  registrandoNotaHistorial = false;

  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  abrirPopupCambiarEstado(row: QuejaSugerenciaDenunciaAdminDto): void {
    this.idElementoSeleccionado = row.id;
    this.idEstadoSeleccionado = row.stateId;
    this.textoContextoCambioEstado = `Registro #${row.id} · ${row.tipo} · Estado actual: ${row.estado}`;
    this.popupVisibleCambiarEstado = true;
  }

  cerrarPopupCambiarEstado = () => { this.popupVisibleCambiarEstado = false };

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargandoContenido = true;
    Promise.all([
      this.gestionesVariasService.obtenerQuejasSugerenciasDenuncias(),
      this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasStates(),
    ])
      .then(([lista, estados]) => {
        this.datos = lista ?? [];
        this.estados = estados ?? [];
      })
      .catch((err) => {
        this.datos = [];
        this.estados = [];
        this.toastr.danger(this.mensajeDeError(err), 'No se pudieron cargar los datos');
      })
      .finally(() => {
        this.cargandoContenido = false;
      });
  }

  texto: string = '';

  /** Icono Eva + status Nebular según texto de tipo (queja / sugerencia / denuncia). */
  iconoTipoQueja(row: QuejaSugerenciaDenunciaAdminDto): { icon: string; status: NbComponentStatus } {
    const raw = (row.tipo || '').trim().toLowerCase();
    const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (norm.includes('queja')) {
      return { icon: 'message-circle-outline', status: 'warning' };
    }
    if (norm.includes('sugerencia')) {
      return { icon: 'bulb-outline', status: 'success' };
    }
    if (norm.includes('denuncia')) {
      return { icon: 'flag-outline', status: 'danger' };
    }
    return { icon: 'file-text-outline', status: 'basic' };
  }

  /** Icono Eva + status según estado del registro (texto y/o catálogo `estados`). */
  iconoEstadoQueja(row: QuejaSugerenciaDenunciaAdminDto): { icon: string; status: NbComponentStatus } {
    const dto = this.estados.find((s) => s.id === row.stateId);
    const raw = (dto?.state ?? row.estado ?? '').trim().toLowerCase();
    const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (norm.includes('rechaz') || norm.includes('cancel')) {
      return { icon: 'close-circle-outline', status: 'danger' };
    }
    if (norm.includes('cerrad') || norm.includes('finaliz') || norm.includes('resuelto') || norm.includes('completad')) {
      return { icon: 'checkmark-circle-outline', status: 'success' };
    }
    if (norm.includes('proceso') || norm.includes('seguimiento') || norm.includes('tramite')) {
      return { icon: 'clock-outline', status: 'primary' };
    }
    if (norm.includes('archiv')) {
      return { icon: 'archive-outline', status: 'basic' };
    }
    if (norm.includes('leido') || norm.includes('leído') || norm.includes('visto')) {
      return { icon: 'eye-outline', status: 'info' };
    }
    if (norm.includes('pendiente') || norm.includes('nuevo') || norm.includes('sin leer') || norm.includes('por revisar')) {
      return { icon: 'inbox-outline', status: 'warning' };
    }
    if (row.stateId === 1) {
      return { icon: 'inbox-outline', status: 'warning' };
    }
    return { icon: 'radio-button-on-outline', status: 'basic' };
  }

  truncarDescripcion(texto: string | undefined, maxCaracteres = 64): string {
    if (!texto) {
      return '';
    }
    const t = texto.trim();
    return t.length <= maxCaracteres ? t : `${t.substring(0, maxCaracteres)}…`;
  }

  abrirDetalle(row: QuejaSugerenciaDenunciaAdminDto, ev?: Event): void {
    ev?.stopPropagation();
    ev?.preventDefault();
    this.registroDetalle = { ...row };
    this.historialLog = [];
    this.notaHistorialTexto = '';
    this.popupDetalleVisible = true;
    this.cargarHistorialLogRegistro(row.id);
    this.cargarAccionesCorrectivasRegistro(row.id);
  }

  private cargarAccionesCorrectivasRegistro(registroId: number): void {
    this.cargandoAccionesCorrectivas = true;
    this.accionesCorrectivasDetalle = [];
    this.quejasDenunciasSugerenciasService.obtenerAccionesCorrectivas(registroId)
      .then((lista) => {
        this.accionesCorrectivasDetalle = lista ?? [];
      })
      .catch((err) => {
        this.accionesCorrectivasDetalle = [];
        this.toastr.danger(this.mensajeDeError(err), 'No se pudieron cargar las acciones correctivas');
      })
      .finally(() => {
        this.cargandoAccionesCorrectivas = false;
      });
  }

  registrarNotaHistorial(): void {
    if (!this.registroDetalle) {
      return;
    }
    const texto = this.notaHistorialTexto.trim();
    if (!texto) {
      this.toastr.warning('Escriba una nota antes de registrar.', 'Historial');
      return;
    }
    this.registrandoNotaHistorial = true;
    const dto: QuejaSugerenciaDenunciaLogCreateDto = {
      quejaSugerenciaDenunciaId: this.registroDetalle.id,
      accion: 'NOTA_INTERNA',
      detalle: JSON.stringify({ comentario: texto }),
    };
    this.gestionesVariasService.registrarQuejaSugerenciaDenunciaLog(dto)
      .then((ok) => {
        if (ok === true) {
          this.notaHistorialTexto = '';
          this.toastr.success('La nota quedó registrada en el historial.', 'Historial');
          this.cargarHistorialLogRegistro(this.registroDetalle!.id);
        } else {
          this.toastr.warning('No se pudo confirmar el registro de la nota.', 'Historial');
        }
      })
      .catch((err) => {
        this.toastr.danger(this.mensajeDeError(err), 'Error al registrar nota');
      })
      .finally(() => {
        this.registrandoNotaHistorial = false;
      });
  }

  /** Texto del estado (mapeo por id) para columnas del historial. */
  descripcionEstadoQueja(estadoId: number | undefined | null): string {
    if (estadoId === undefined || estadoId === null) {
      return '—';
    }
    const e = this.estados.find((s) => s.id === estadoId);
    return e ? e.state : `#${estadoId}`;
  }

  /**
   * Texto de la columna «Usuario» del historial: solo para cambios de estado (manual o automático).
   * No muestra actor en CREADA ni en notas internas.
   * Importante: no se compara con el creador del registro; si el API envía usuario en un cambio de estado,
   * se muestra siempre (aunque sea la misma persona que creó la queja). Si la celda queda vacía es porque
   * `usuarioNombre` / `usuarioId` no vienen en la respuesta del log para esa fila.
   */
  textoUsuarioHistorial(log: QuejaSugerenciaDenunciaLogDto): string {
    if (!this.esAccionCambioEstadoLog(log.accion)) {
      return '';
    }
    const nombre = (log.usuarioNombre || '').trim();
    if (nombre) {
      return nombre;
    }
    if (log.usuarioId !== undefined && log.usuarioId !== null && !Number.isNaN(Number(log.usuarioId))) {
      return `Usuario #${log.usuarioId}`;
    }
    if (log.idUser !== undefined && log.idUser !== null && !Number.isNaN(Number(log.idUser))) {
      return `Usuario #${log.idUser}`;
    }
    return '';
  }

  /** True si la fila corresponde a un cambio de estado (variantes de texto del API). */
  private esAccionCambioEstadoLog(accion: string | undefined): boolean {
    const a = (accion || '').trim().toUpperCase();
    if (a === 'ESTADO_CAMBIADO_MANUAL' || a === 'ESTADO_CAMBIADO_AUTO' || a === 'MARCA_COMO_LEIDO') {
      return true;
    }
    if (a.includes('ESTADO') && a.includes('MANUAL')) {
      return true;
    }
    if (a.includes('ESTADO') && a.includes('AUTO')) {
      return true;
    }
    return false;
  }

  /** Etiqueta legible para la columna «Acción» del historial. */
  etiquetaAccionLog(accion: string | undefined): string {
    if (!accion) {
      return '—';
    }
    const map: Record<string, string> = {
      CREADA: 'Registro creado',
      ESTADO_CAMBIADO_AUTO: 'Estado (automático)',
      ESTADO_CAMBIADO_MANUAL: 'Estado (manual)',
      MARCA_COMO_LEIDO: 'Marcado como leído',
      NOTA_INTERNA: 'Nota interna',
      ACCION_CORRECTIVA_REGISTRADA: 'Acción correctiva registrada',
    };
    return map[accion] ?? accion;
  }

  /** Muestra texto o extrae `comentario` / `nota` si `detalle` es JSON. */
  textoDetalleLog(detalle: string | undefined): string {
    if (!detalle) {
      return '';
    }
    try {
      const o = JSON.parse(detalle) as Record<string, unknown>;
      if (o && typeof o === 'object') {
        if ('comentario' in o && o['comentario'] != null) {
          return String(o['comentario']);
        }
        if ('nota' in o && o['nota'] != null) {
          return String(o['nota']);
        }
      }
    } catch {
      /* texto plano */
    }
    return detalle;
  }

  onDetallePopupHidden(): void {
    this.registroDetalle = null;
    this.historialLog = [];
    this.accionesCorrectivasDetalle = [];
    this.cargandoLogDetalle = false;
    this.cargandoAccionesCorrectivas = false;
    this.notaHistorialTexto = '';
  }

  private cargarHistorialLogRegistro(registroId: number): void {
    this.cargandoLogDetalle = true;
    this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasLog(registroId)
      .then((lista) => {
        const filas = lista ?? [];
        this.historialLog = filas.map((item) => this.normalizarLogDelApi(item as unknown as Record<string, unknown>));
      })
      .catch((err) => {
        this.historialLog = [];
        this.toastr.danger(this.mensajeDeError(err), 'No se pudo cargar el historial');
      })
      .finally(() => {
        this.cargandoLogDetalle = false;
      });
  }

  /** Sincroniza la cabecera del modal con la fila actual del listado (tras cambios de estado). */
  private sincronizarRegistroDetalleDesdeLista(registroId: number): void {
    if (!this.registroDetalle || this.registroDetalle.id !== registroId) {
      return;
    }
    const fila = this.datos.find((d) => d.id === registroId);
    if (fila) {
      Object.assign(this.registroDetalle, fila);
    }
  }

  /** Si el detalle está abierto para ese id, recarga el historial desde el servidor. */
  private refrescarHistorialSiVistaDetalle(registroId: number): void {
    this.sincronizarRegistroDetalleDesdeLista(registroId);
    if (!this.popupDetalleVisible || !this.registroDetalle || this.registroDetalle.id !== registroId) {
      return;
    }
    this.cargarHistorialLogRegistro(registroId);
  }

  /**
   * Abre el popup de lectura, registra lectura en backend (avance automático de estado)
   * y refresca el listado si el registro estaba pendiente (stateId === 1).
   */
  marcarComoLeido(row: QuejaSugerenciaDenunciaAdminDto): void {
    this.texto = row.descripcion;
    this.abrirPopup();

    this.cargandoContenido = true;
    this.gestionesVariasService.CambiarEstadoQuejasSugerenciasDenuncia(row.id)
      .then((ok) => {
        if (ok === true && row.stateId === 1) {
          return this.gestionesVariasService.obtenerQuejasSugerenciasDenuncias().then((lista) => {
            this.datos = lista ?? [];
            this.toastr.success('El registro se marcó como leído y la lista se actualizó.', 'Éxito');
            this.refrescarHistorialSiVistaDetalle(row.id);
          });
        }
        if (ok !== true) {
          this.toastr.warning('No se pudo completar el cambio de estado.', 'Atención');
        }
      })
      .catch((err) => {
        this.toastr.danger(this.mensajeDeError(err), 'Error al marcar como leído');
      })
      .finally(() => {
        this.cargandoContenido = false;
      });
  }

  confirmar(): void {
    const estadoDto = this.estados.find((item) => item.id === this.idEstadoSeleccionado);
    if (this.esEstadoCompletado(estadoDto)) {
      this.cerrarPopupCambiarEstado();
      this.limpiarModalAccionCorrectiva();
      this.popupAccionCorrectivaVisible = true;
      return;
    }
    this.ejecutarCambioEstadoManual();
  }

  private ejecutarCambioEstadoManual(): void {
    const idAfectado = this.idElementoSeleccionado;
    this.cargandoContenido = true;
    this.gestionesVariasService.CambiarEstadoQuejasSugerenciasDenunciaManual(this.idElementoSeleccionado, this.idEstadoSeleccionado)
      .then((ok) => {
        if (ok !== true) {
          this.toastr.warning('La operación no devolvió confirmación.', 'Atención');
          return;
        }
        this.cerrarPopupCambiarEstado();
        const fecha = new Date();
        const fila = this.datos.find((item) => item.id === this.idElementoSeleccionado);
        const estadoDto = this.estados.find((item) => item.id === this.idEstadoSeleccionado);
        if (fila && estadoDto) {
          fila.estado = estadoDto.state;
          fila.stateId = this.idEstadoSeleccionado;
          fila.lastModification = fecha.toString();
        }
        this.toastr.success('El estado se actualizó correctamente.', 'Éxito');
        this.refrescarHistorialSiVistaDetalle(idAfectado);
      })
      .catch((err) => {
        this.toastr.danger(this.mensajeDeError(err), 'Error al cambiar estado');
      })
      .finally(() => {
        this.cargandoContenido = false;
      });
  }

  confirmarAccionCorrectiva(): void {
    const descripcion = this.descripcionAccionCorrectiva.trim();
    if (!descripcion) {
      this.toastr.warning('Describa la acción correctiva implementada.', 'Acción correctiva');
      return;
    }

    const dto: QuejaSugerenciaDenunciaAccionCorrectivaCreateDto = {
      idQuejaSugerenciaDenuncia: this.idElementoSeleccionado,
      descripcionAccion: descripcion,
      estadoCompletadoId: this.idEstadoSeleccionado,
      fechaImplementacion: this.fechaImplementacionAccion.toISOString(),
    };

    this.guardandoAccionCorrectiva = true;
    this.cargandoContenido = true;
    this.quejasDenunciasSugerenciasService.guardarAccionCorrectivaYCompletar(dto, this.archivosEvidenciaAccion)
      .then((ok) => {
        if (ok !== true) {
          this.toastr.warning('No se pudo confirmar el registro de la acción correctiva.', 'Atención');
          return;
        }
        this.popupAccionCorrectivaVisible = false;
        this.limpiarModalAccionCorrectiva();
        const idAfectado = this.idElementoSeleccionado;
        const estadoDto = this.estados.find((item) => item.id === this.idEstadoSeleccionado);
        const fila = this.datos.find((item) => item.id === idAfectado);
        if (fila && estadoDto) {
          fila.estado = estadoDto.state;
          fila.stateId = this.idEstadoSeleccionado;
          fila.lastModification = new Date().toString();
        }
        this.toastr.success('Acción correctiva registrada y registro marcado como completado.', 'Éxito');
        this.refrescarHistorialSiVistaDetalle(idAfectado);
        if (this.popupDetalleVisible && this.registroDetalle?.id === idAfectado) {
          this.cargarAccionesCorrectivasRegistro(idAfectado);
        }
      })
      .catch((err) => {
        this.toastr.danger(this.mensajeDeError(err), 'Error al guardar acción correctiva');
      })
      .finally(() => {
        this.guardandoAccionCorrectiva = false;
        this.cargandoContenido = false;
      });
  }

  cancelarAccionCorrectiva(): void {
    this.popupAccionCorrectivaVisible = false;
    this.limpiarModalAccionCorrectiva();
  }

  onAccionCorrectivaPopupHidden(): void {
    this.limpiarModalAccionCorrectiva();
  }

  iniciarFileUploaderEvidencia(event: { component: { reset: () => void } }): void {
    this.fileUploaderEvidenciaControl = event.component;
  }

  limpiarAdjuntosEvidencia(): void {
    this.archivosEvidenciaAccion = [];
    this.fileUploaderEvidenciaControl?.reset();
  }

  private limpiarModalAccionCorrectiva(): void {
    this.descripcionAccionCorrectiva = '';
    this.fechaImplementacionAccion = new Date();
    this.archivosEvidenciaAccion = [];
    this.fileUploaderEvidenciaControl?.reset();
    this.fileUploaderEvidenciaControl = null;
  }

  onArchivosEvidenciaCambiados(data: { value: File[] }): void {
    this.archivosEvidenciaAccion = data?.value ? [...data.value] : [];
  }

  descargarEvidencia(idEvidencia: number, nombreArchivo: string): void {
    this.quejasDenunciasSugerenciasService.descargarEvidencia(idEvidencia)
      .then((blob) => {
        if (!blob) {
          this.toastr.warning('No se recibió el archivo.', 'Descarga');
          return;
        }
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombreArchivo || `evidencia-${idEvidencia}`;
        enlace.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        this.toastr.danger(this.mensajeDeError(err), 'Error al descargar evidencia');
      });
  }

  private esEstadoCompletado(estado?: QuejaSugerenciaDenunciaStateDto): boolean {
    if (!estado) {
      return false;
    }
    const norm = (estado.state || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return norm.includes('completad');
  }

  cancelar(): void {
    this.cerrarPopupCambiarEstado();
  }

  estadoSeleccionado(data: { value: number }): void {
    this.idEstadoSeleccionado = data.value;
  }

  /** Acepta respuesta en camelCase o PascalCase; compatible con audit_log (`idEntidad`, `idUser`) y DTO legado. */
  private normalizarLogDelApi(raw: Record<string, unknown>): QuejaSugerenciaDenunciaLogDto {
    const detalle = this.optString(raw['detalle'] ?? raw['Detalle']);
    const desdeDetalle = this.extraerUsuarioDesdeDetalleLog(detalle);
    const usuarioId = this.optUsuarioIdLog(raw) ?? desdeDetalle.id;
    const usuarioNombre = this.optNombreUsuarioLog(raw) ?? desdeDetalle.nombre;
    const fh = this.parseFechaHistorialLog(
      raw['fechaHora'] ?? raw['FechaHora'] ?? raw['fechaHoraUtc'] ?? raw['FechaHoraUtc'],
    );
    const idQueja = Number(
      raw['quejaSugerenciaDenunciaId'] ?? raw['QuejaSugerenciaDenunciaId']
        ?? raw['idEntidad'] ?? raw['IdEntidad'] ?? 0,
    );
    return {
      id: Number(raw['id'] ?? raw['Id']),
      quejaSugerenciaDenunciaId: Number.isNaN(idQueja) ? 0 : idQueja,
      fechaHora: fh,
      accion: String(raw['accion'] ?? raw['Accion'] ?? ''),
      estadoAnteriorId: this.optNumero(raw['estadoAnteriorId'] ?? raw['EstadoAnteriorId']),
      estadoNuevoId: this.optNumero(raw['estadoNuevoId'] ?? raw['EstadoNuevoId']),
      usuarioId,
      idUser: this.optNumeroFlexible(raw['idUser'] ?? raw['IdUser']),
      usuarioNombre,
      detalle,
    };
  }

  /** Convierte la fecha del API a `Date` para que DevExtreme muestre bien la columna datetime. */
  private parseFechaHistorialLog(val: unknown): Date | undefined {
    if (val == null || val === '') {
      return undefined;
    }
    if (val instanceof Date) {
      return Number.isNaN(val.getTime()) ? undefined : val;
    }
    const s = String(val).trim();
    if (!s) {
      return undefined;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }

  /** Id de usuario en el log: API audit (`idUser`) y DTO quejas (`usuarioId`). */
  private optUsuarioIdLog(raw: Record<string, unknown>): number | undefined {
    const keys = [
      'idUser', 'IdUser',
      'usuarioId', 'UsuarioId', 'userId', 'UserId', 'idUsuario', 'IdUsuario',
      'usuarioModificadorId', 'UsuarioModificadorId', 'usuarioEjecutorId', 'UsuarioEjecutorId',
      'empleadoId', 'EmpleadoId', 'usuarioAdministradorId', 'UsuarioAdministradorId',
    ];
    for (const k of keys) {
      const n = this.optNumeroFlexible(raw[k]);
      if (n !== undefined) {
        return n;
      }
    }
    return undefined;
  }

  private optNumeroFlexible(val: unknown): number | undefined {
    if (val === null || val === undefined || val === '') {
      return undefined;
    }
    if (typeof val === 'string' && /^\d+$/.test(val.trim())) {
      return Number(val.trim());
    }
    return this.optNumero(val);
  }

  /** Si el API guardó usuario en JSON dentro de `detalle`. */
  private extraerUsuarioDesdeDetalleLog(detalle: string | undefined): { nombre?: string; id?: number } {
    if (!detalle) {
      return {};
    }
    try {
      const o = JSON.parse(detalle) as Record<string, unknown>;
      if (!o || typeof o !== 'object') {
        return {};
      }
      const nombreKeys = [
        'usuarioNombre', 'UsuarioNombre', 'userName', 'UserName', 'modificadoPor', 'ModificadoPor',
        'nombreUsuario', 'NombreUsuario',
      ];
      let nombre: string | undefined;
      for (const k of nombreKeys) {
        nombre = this.optStringSiEsTexto(o[k]);
        if (nombre) {
          break;
        }
      }
      if (!nombre) {
        const uRaw = o['usuario'] ?? o['Usuario'];
        if (typeof uRaw === 'string') {
          nombre = this.optString(uRaw);
        } else if (uRaw && typeof uRaw === 'object') {
          const uo = uRaw as Record<string, unknown>;
          nombre = this.optStringSiEsTexto(uo['nombre'] ?? uo['Nombre'] ?? uo['userName'] ?? uo['UserName']);
        }
      }
      const id = this.optNumeroFlexible(o['usuarioId'] ?? o['UsuarioId'] ?? o['userId'] ?? o['UserId'] ?? o['empleadoId'] ?? o['EmpleadoId']);
      return { nombre: nombre ?? undefined, id };
    } catch {
      return {};
    }
  }

  private optStringSiEsTexto(val: unknown): string | undefined {
    if (typeof val !== 'string') {
      return undefined;
    }
    return this.optString(val);
  }

  /** Nombre o login del usuario en distintas formas de serialización del API. */
  private optNombreUsuarioLog(raw: Record<string, unknown>): string | undefined {
    const directKeys = [
      'usuarioNombre', 'UsuarioNombre', 'nombreUsuario', 'NombreUsuario',
      'userName', 'UserName', 'usuarioLogin', 'UsuarioLogin', 'login', 'Login',
      'modificadoPor', 'ModificadoPor', 'usuarioEjecutor', 'UsuarioEjecutor', 'nombreEmpleado', 'NombreEmpleado',
    ];
    for (const k of directKeys) {
      const s = this.optString(raw[k]);
      if (s) {
        return s;
      }
    }
    const uStr = this.optString(raw['Usuario'] ?? raw['usuario']);
    if (uStr && !uStr.trim().startsWith('{')) {
      return uStr;
    }
    const u = raw['usuario'] ?? raw['Usuario'];
    if (u && typeof u === 'object') {
      const o = u as Record<string, unknown>;
      const nested = this.optString(
        o['nombre'] ?? o['Nombre'] ?? o['userName'] ?? o['UserName'] ?? o['usuarioNombre'] ?? o['UsuarioNombre']
          ?? o['nombreCompleto'] ?? o['NombreCompleto'],
      );
      if (nested) {
        return nested;
      }
    }
    return undefined;
  }

  private optNumero(val: unknown): number | undefined {
    if (val === null || val === undefined || val === '') {
      return undefined;
    }
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }

  private optString(val: unknown): string | undefined {
    if (val === null || val === undefined) {
      return undefined;
    }
    const s = String(val);
    return s.length ? s : undefined;
  }

  private mensajeDeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body && typeof body === 'object' && 'message' in body && typeof (body as { message: unknown }).message === 'string') {
        return (body as { message: string }).message;
      }
      return err.message || `Error HTTP ${err.status}.`;
    }
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as { message: unknown }).message);
    }
    return 'No se pudo completar la operación. Intente de nuevo o contacte a TI.';
  }
}
