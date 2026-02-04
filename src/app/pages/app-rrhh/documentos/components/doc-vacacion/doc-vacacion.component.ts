import { Component, Input, OnInit } from '@angular/core';
import { VacacionDocDto } from '../../models/vacacion-doc-dto';

@Component({
  selector: 'doc-vacacion',
  templateUrl: './doc-vacacion.component.html',
  styleUrls: ['./doc-vacacion.component.css']
})
export class DocVacacionComponent implements OnInit {
  @Input() vacacion: VacacionDocDto;
  @Input() reporteEsVisible: boolean;

  now: Date = new Date();
  constructor() { 
    this.vacacion = new VacacionDocDto();
    this.vacacion.observaciones = "";
  }
  
  ngOnInit(): void {
    this.vacacion = new VacacionDocDto();
    this.vacacion.observaciones = "";
  }

}
