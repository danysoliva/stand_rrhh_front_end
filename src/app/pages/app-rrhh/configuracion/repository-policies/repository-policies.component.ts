import { Component, OnInit } from '@angular/core';
import { RepositorioDocumentoDto, TipoRepositorioEnum } from '../../../../model/uploads/repositorio-documento-dto';
import { UploadService } from '../../../../servicio/upload.service';

@Component({
  selector: 'ngx-repository-policies',
  templateUrl: './repository-policies.component.html',
  styleUrls: ['./repository-policies.component.scss']
})
export class RepositoryPoliciesComponent implements OnInit {


  constructor(private uploadService:UploadService) { }

  politicas: RepositorioDocumentoDto[];

  url: string;


  ngOnInit(): void {

    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Politicas).then((data) => {
      this.politicas = data;
      // console.log(data);
      
    });
  }
}
