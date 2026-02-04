import { Component, OnInit } from '@angular/core';
import { EncuestaEstadoFiltroDto } from '../../../../model/encuesta/encuesta-estado-filtro-dto';
import { EncuestaNameFiltroDto } from '../../../../model/encuesta/encuesta-name-filtro-dto';
import { EncuestaTabulacionDto } from '../../../../model/encuesta/encuesta-tabulacion-dto';
import { EncuestaService } from '../../../../servicio/encuesta.service';

@Component({
  selector: 'ngx-encuestas-tabulacion',
  templateUrl: './encuestas-tabulacion.component.html',
  styleUrls: ['./encuestas-tabulacion.component.scss']
})
export class EncuestasTabulacionComponent implements OnInit {

  constructor(private encuestaService:EncuestaService) { }

  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: any = 'estado';

  searchTimeoutOption2 = 200;
  searchModeOption2 = 'contains';

  pivot: EncuestaTabulacionDto[];

  estados: EncuestaEstadoFiltroDto[];
  encuestas:EncuestaNameFiltroDto[]
  searchExprOption2: any = 'descripcion';
  ngOnInit(): void {
    this.encuestaService.ObtenerFiltrosDeEncuestaTabulacion().then((data)=>{
      this.encuestas=data.encuestas;
      this.estados = data.estados;      
    })
  }

  cambioEstado(e){
    
    let estadoId;

    if (e.value===null)
      estadoId=0;
      else
       estadoId=e.value;


    this.encuestas=[];
    this.encuestaService.ObtenerEncuestasFiltradasPorEstado(estadoId).then((data)=>{

      this.encuestas=data;
    })
 }

 cambioEncuesta(e){

  let encuestaId

  
    if (e.value===null)
      encuestaId=0;
      else
        encuestaId=e.value
  
  this.encuestaService.ObtenerEncuestaPivot(encuestaId).then(data=>{
      this.pivot=data;
      // console.log(data);
      
    })
 }

}
