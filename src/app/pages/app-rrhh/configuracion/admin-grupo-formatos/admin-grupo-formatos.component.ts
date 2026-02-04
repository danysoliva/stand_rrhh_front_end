import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RepositorioDocumentoDto } from '../../../../model/uploads/repositorio-documento-dto';
import { RepositoryGroupDto } from '../../../../model/uploads/repository-group-dto';
import { UploadService } from '../../../../servicio/upload.service';
import { log } from 'console';

@Component({
  selector: 'ngx-admin-grupo-formatos',
  templateUrl: './admin-grupo-formatos.component.html',
  styleUrls: ['./admin-grupo-formatos.component.scss']
})
export class AdminGrupoFormatosComponent implements OnInit,OnDestroy  {

  constructor(private uploadService:UploadService) { }
  @Output() onSaved = new EventEmitter<boolean>();
  // @Input() opened= false;

  grupos: RepositoryGroupDto[];

  ngOnInit(): void {
    this.cargarGrupos();
  }

  ngOnDestroy(): void {
    
  }

  CerrarVentana(){
    this.onSaved.emit(true);
  }

  async cargarGrupos(){
    this.grupos = await this.uploadService.obtenerDocumentosGrupo(); 
   }
 
   logEventEdited(e){
    
    let data ={
      id : e.key,
      descripcion: e.data.descripcion,
      tipoCRUD:2
    }

    this.uploadService.GrupoCRUD(data);
   }

   logEventRemoved(e){
    
    let data ={
      id : e.key,
      descripcion: e.data.descripcion,
      tipoCRUD:3
    }

    this.uploadService.GrupoCRUD(data);

   }

   logEventInserted(e){
    let data ={
      id : 0,
      descripcion: e.descripcion,
      tipoCRUD:1
    }

    this.uploadService.GrupoCRUD(data);

      
   }

}
