import { Component, OnInit } from '@angular/core';
import { QuejaSugerenciaDenunciaAdminDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-admin-dto';
import { QuejaSugerenciaDenunciaDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-dto';
import { GestionesVariasService } from '../../../servicio/gestiones-varias.service';
import { QuejaSugerenciaDenunciaStateDto } from '../../../model/gestiones-varias/queja-sugerencia-denuncia-state-dto';

@Component({
  selector: 'ngx-quejas-sugerencias-denuncias-admin',
  templateUrl: './quejas-sugerencias-denuncias-admin.component.html',
  styleUrls: ['./quejas-sugerencias-denuncias-admin.component.scss']
})
export class QuejasSugerenciasDenunciasAdminComponent implements OnInit {

  constructor(private gestionesVariasService:GestionesVariasService) { }

  datos:QuejaSugerenciaDenunciaAdminDto[];

  estados:QuejaSugerenciaDenunciaStateDto[];

  idElementoSeleccionado:number;
  idEstadoSeleccionado:number;

  popupVisible: boolean = false;
  popupVisibleCambiarEstado: boolean = false;

  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  abrirPopupCambiarEstado = (e) => { this.idElementoSeleccionado=e.id; this.popupVisibleCambiarEstado = true };
  cerrarPopupCambiarEstado = () => { this.popupVisibleCambiarEstado = false };
  
  ngOnInit(): void {

    this.gestionesVariasService.obtenerQuejasSugerenciasDenuncias().then((data)=>{

      this.datos= data
      
    })

    this.gestionesVariasService.obtenerQuejasSugerenciasDenunciasStates().then((data)=>{

      this.estados= data    
    })

  }

  texto:string;

  ver(e){
    
    if (e.rowType!='filter') {
        this.abrirPopup();
      this.texto=e.data.descripcion;   
      this.gestionesVariasService.CambiarEstadoQuejasSugerenciasDenuncia(e.data.id).then( (data)=>{
        
        if (data===true && e.data.stateId===1) {
          this.datos=[];
          this.gestionesVariasService.obtenerQuejasSugerenciasDenuncias().then(data=>{
            this.datos=data;
          })
        }
      })
      }
    
    
  }

  confirmar(){

    this.gestionesVariasService.CambiarEstadoQuejasSugerenciasDenunciaManual(this.idElementoSeleccionado,this.idEstadoSeleccionado)
    .then (data=>{
      this.cerrarPopupCambiarEstado();
    var fecha=new Date();

      this.datos.find(item => item.id === this.idElementoSeleccionado).estado= this.estados.find(item=> item.id==this.idEstadoSeleccionado).state;
      this.datos.find(item => item.id === this.idElementoSeleccionado).lastModification= fecha.toString();
      
    });

  }

  cancelar(){
    this.cerrarPopupCambiarEstado();
  }

  estadoSeleccionado(data){
    this.idEstadoSeleccionado=data.value;
  }

}
