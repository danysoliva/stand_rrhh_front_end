import { Component, Input, OnInit } from '@angular/core';
import { VacacionDocNewFormatDto } from '../../models/vacacion-doc-new-format-dto';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'doc-vacacion-new-format-pdf',
  templateUrl: './doc-vacacion-new-format-pdf.component.html',
  styleUrls: ['./doc-vacacion-new-format-pdf.component.css'],
  
  
})

export class DocVacacionNewFormatPdfComponent implements OnInit {
  @Input() vacacion: VacacionDocNewFormatDto;
  @Input() reporteEsVisible: boolean = false;
  logoSrc: string;

  now: Date = new Date();
  cantidadVacacionesEnLetras: string;

  constructor() {
    this.vacacion = new VacacionDocNewFormatDto();
    this.vacacion.observaciones = '';
    this.cantidadVacacionesEnLetras = numeroALetras(this.vacacion.cantidadDiasVacacion);
    this.logoSrc = new URL('assets/images/aquafeed.png', document.baseURI).href;
  }

  ngOnInit(): void {
    if (!this.vacacion) {
      this.vacacion = new VacacionDocNewFormatDto();
      this.vacacion.observaciones = '';
    }
  }
}

function numeroALetras(numero: number): string {
  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve'];

  if (numero === 0) {
    return 'cero';
  }

  if (numero < 10) {
    return unidades[numero];
  }

  if (numero < 20) {
    return especiales[numero - 10];
  }

  const unidad = numero % 10;
  const decena = Math.floor(numero / 10) % 10;
  const centena = Math.floor(numero / 100);

  let resultado = '';

  if (centena > 0) {
    resultado += unidades[centena] + ' cientos';
    if (decena > 0 || unidad > 0) {
      resultado += ' ';
    }
  }

  if (decena > 0) {
    if (decena === 1 && unidad > 0) {
      resultado += especiales[unidad];
    } else {
      resultado += decenas[decena];
      if (unidad > 0) {
        resultado += ' y ';
      }
    }
  }

  if (unidad > 0) {
    resultado += unidades[unidad];
  }

  return resultado;
}
