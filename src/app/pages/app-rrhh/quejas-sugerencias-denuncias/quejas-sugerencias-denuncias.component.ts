import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { QuejaSugerenciaDenunciaTypeDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-type-dto';
import { GestionesVariasService } from '../../../servicio/gestiones-varias.service';
import { Alerts } from '../../../_common/utils/alerts';

@Component({
  selector: 'ngx-quejas-sugerencias-denuncias',
  templateUrl: './quejas-sugerencias-denuncias.component.html',
  styleUrls: ['./quejas-sugerencias-denuncias.component.scss']
})
export class QuejasSugerenciasDenunciasComponent implements OnInit, OnDestroy {

  readonly maxCaracteresComentario = 4000;

  get inputAttrComentario(): { id: string; maxlength: string } {
    return { id: 'qsd-comentario', maxlength: String(this.maxCaracteresComentario) };
  }

  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: 'descripcion' = 'descripcion';

  tipos: QuejaSugerenciaDenunciaTypeDto[] = [];
  cargandoTipos = true;
  enviando = false;

  QuejasDenunciasSugerenciasForm = new UntypedFormGroup({
    tipo: new UntypedFormControl(null, Validators.required),
    descripcion: new UntypedFormControl('', [Validators.maxLength(this.maxCaracteresComentario)]),
  });

  /** Texto con contenido real (trim); actualizado también al pegar desde el portapapeles. */
  comentarioValido = false;

  private readonly subs = new Subscription();

  constructor(private gestionesVariasService: GestionesVariasService) { }

  get longitudComentario(): number {
    const v = this.QuejasDenunciasSugerenciasForm.get('descripcion')?.value;
    return (v ?? '').toString().length;
  }

  ngOnInit(): void {
    const ctrlDesc = this.QuejasDenunciasSugerenciasForm.get('descripcion');
    if (ctrlDesc) {
      this.subs.add(
        ctrlDesc.valueChanges.pipe(startWith(ctrlDesc.value)).subscribe(() => {
          this.actualizarValidezComentario();
        }),
      );
    }

    this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasType()
      .then((data) => {
        this.tipos = data ?? [];
      })
      .catch((err) => {
        this.tipos = [];
        Alerts.error('No se pudieron cargar los tipos', this.mensajeErrorHttp(err));
      })
      .finally(() => {
        this.cargandoTipos = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onComentarioValueChanged(): void {
    this.actualizarValidezComentario();
  }

  private actualizarValidezComentario(): void {
    const raw = this.QuejasDenunciasSugerenciasForm.get('descripcion')?.value;
    this.comentarioValido = (raw ?? '').toString().trim().length > 0;
  }

  guardar(): void {
    if (this.enviando || this.cargandoTipos) {
      return;
    }

    const tipo = this.QuejasDenunciasSugerenciasForm.get('tipo')?.value;
    const descripcion = (this.QuejasDenunciasSugerenciasForm.get('descripcion')?.value ?? '').toString().trim();

    if (tipo == null || tipo === '' || Number.isNaN(Number(tipo))) {
      Alerts.warning('Tipo requerido', 'Seleccione si su registro es una queja, una sugerencia o una denuncia.');
      this.QuejasDenunciasSugerenciasForm.get('tipo')?.markAsTouched();
      return;
    }

    if (!descripcion) {
      Alerts.warning('Comentario requerido', 'Escriba su comentario antes de enviar.');
      this.QuejasDenunciasSugerenciasForm.get('descripcion')?.markAsTouched();
      return;
    }

    this.enviando = true;

    const dto = {
      id: 0,
      stateId: 1,
      descripcion,
      typeId: Number(tipo),
      createDate: '',
      estado: '',
      tipo: ''
    };

    this.gestionesVariasService.guardarQuejaSugerenciaDenuncia(dto)
      .then((ok) => {
        if (ok === true) {
          Alerts.success('Gracias', 'Su opinión fue registrada correctamente.');
          this.QuejasDenunciasSugerenciasForm.reset({ tipo: null, descripcion: '' });
          this.comentarioValido = false;
        } else {
          Alerts.warning('Atención', 'No se pudo confirmar el registro. Intente de nuevo o contacte a TI.');
        }
      })
      .catch((err) => {
        Alerts.error('Error al enviar', this.mensajeErrorHttp(err));
      })
      .finally(() => {
        this.enviando = false;
      });
  }

  private mensajeErrorHttp(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body && typeof body === 'object' && 'message' in body && typeof (body as { message: unknown }).message === 'string') {
        return (body as { message: string }).message;
      }
      return err.message || `Error de red (${err.status}).`;
    }
    return 'No se pudo completar el envío. Verifique su conexión e intente de nuevo.';
  }
}
