// import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';
import { QuejaSugerenciaDenunciaStateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-state-dto';
import { QuejaSugerenciaDenunciaTypeDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-type-dto';
import { GestionesVariasService } from '../../../servicio/gestiones-varias.service';
import { Alerts } from '../../../_common/utils/alerts';

@Component({
  selector: 'ngx-quejas-sugerencias-denuncias',
  templateUrl: './quejas-sugerencias-denuncias.component.html',
  styleUrls: ['./quejas-sugerencias-denuncias.component.scss']
})
export class QuejasSugerenciasDenunciasComponent implements OnInit {

  

  quejasSugerenciasDenunciasStates: QuejaSugerenciaDenunciaStateDto[];
  
  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: any = 'descripcion';
  popUpVisible:boolean;
  
  abrirPopup = () => { this.popUpVisible = true };
  cerrarPopup = () => { this.popUpVisible = false };


  statuses: NbComponentStatus[] = ['primary', 'success', 'info', 'warning', 'danger'];
  shapes: NbComponentShape[] = ['rectangle', 'semi-round', 'round'];
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];

  tipos: QuejaSugerenciaDenunciaTypeDto[];


  QuejasDenunciasSugerenciasForm = new UntypedFormGroup({
    tipo: new UntypedFormControl(null, Validators.required),
    descripcion: new UntypedFormControl('')
  })

  comentarioValido:boolean = false;
  keyUpComentario(e) {
    const inputValue = e.event.target.value;
    this.comentarioValido = inputValue.length > 0;    
  }

  constructor(private gestionesVariasService: GestionesVariasService, private fb: UntypedFormBuilder) { }



  ngOnInit(): void {

    this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasType().then((data) => {

      this.tipos = data;

    })

  }

  guardar() {

    let dto = {
      id: 0,
      stateId: 1,
      descripcion: this.QuejasDenunciasSugerenciasForm.value.descripcion,
      typeId: Number(this.QuejasDenunciasSugerenciasForm.value.tipo),
      createDate: '',
      estado: '',
      tipo: ''
    }

    this.gestionesVariasService.guardarQuejaSugerenciaDenuncia(dto).then((data) => {

      Alerts.success('Éxito', '¡Gracias por brindarnos su opinión!')
      this.QuejasDenunciasSugerenciasForm.reset();

    })

    // console.log(dto);


  }

  abrir(){
    console.log('Hola');
    this.abrirPopup();
    
  }
  
}
