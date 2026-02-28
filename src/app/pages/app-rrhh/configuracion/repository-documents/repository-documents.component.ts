import { Component, OnInit } from '@angular/core';
import { RepositorioDocumentoDto, TipoRepositorioEnum } from '../../../../model/uploads/repositorio-documento-dto';
import { UploadService } from '../../../../servicio/upload.service';

@Component({
  selector: 'ngx-repository-documents',
  templateUrl: './repository-documents.component.html',
  styleUrls: ['./repository-documents.component.scss']
})
export class RepositoryDocumentsComponent implements OnInit {


  constructor(private uploadService:UploadService) { }

  formatos: RepositorioDocumentoDto[];

  url: string;


  ngOnInit(): void {

    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Formatos).then((data) => {
      this.formatos = data;
      // console.log(data);
      
    });
  }
}
