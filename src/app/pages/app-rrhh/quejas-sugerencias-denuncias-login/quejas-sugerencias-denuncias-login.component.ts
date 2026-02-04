import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NbComponentShape, NbComponentSize, NbComponentStatus } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { QuejaSugerenciaDenunciaStateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-state-dto';
import { QuejaSugerenciaDenunciaTypeDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-type-dto';
import { GestionesVariasService } from '../../../servicio/gestiones-varias.service';
import { Alerts } from '../../../_common/utils/alerts';

@Component({
  selector: 'ngx-quejas-sugerencias-denuncias-login',
  templateUrl: './quejas-sugerencias-denuncias-login.component.html',
  styleUrls: ['./quejas-sugerencias-denuncias-login.component.scss']
})
export class QuejasSugerenciasDenunciasLoginComponent implements OnInit {

  

  quejasSugerenciasDenunciasStates: QuejaSugerenciaDenunciaStateDto[];

  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: any = 'descripcion';

  statuses: NbComponentStatus[] = ['primary', 'success', 'info', 'warning', 'danger'];
  shapes: NbComponentShape[] = ['rectangle', 'semi-round', 'round'];
  sizes: NbComponentSize[] = ['tiny', 'small', 'medium', 'large', 'giant'];

  tipos: QuejaSugerenciaDenunciaTypeDto[];
  host:string;

  QuejasDenunciasSugerenciasForm = new UntypedFormGroup({
    tipo: new UntypedFormControl(null, Validators.required),
    descripcion: new UntypedFormControl('')
  })

  comentarioValido:boolean = false;
  keyUpComentario(e) {
    const inputValue = e.event.target.value;
    this.comentarioValido = inputValue.length > 0;    
  }

  constructor(private gestionesVariasService: GestionesVariasService, private fb: UntypedFormBuilder,private route:Router) { }



  ngOnInit(): void {

    this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasType().then((data) => {

      this.tipos = data;

    })

   this.host= environment.host;

  }

  async guardar() {

    let dto = {
      id: 0,
      stateId: 1,
      descripcion: this.QuejasDenunciasSugerenciasForm.value.descripcion,
      typeId: Number(this.QuejasDenunciasSugerenciasForm.value.tipo),
      createDate: '',
      estado: '',
      tipo: ''
    }

   await this.gestionesVariasService.guardarQuejaSugerenciaDenuncia(dto).then((data) => {

      Alerts.success('Éxito', '¡Gracias por brindarnos su opinión!')
      this.QuejasDenunciasSugerenciasForm.reset();

      this.route.navigate(['/auth/login']);
    })



  }

  back(){
    this.route.navigate(['/auth/login']);
  }

}
