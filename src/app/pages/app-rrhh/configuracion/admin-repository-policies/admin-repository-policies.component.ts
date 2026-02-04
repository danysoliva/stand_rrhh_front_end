import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RepositorioDocumentoDto, TipoRepositorioEnum } from '../../../../model/uploads/repositorio-documento-dto';
import { UploadService } from '../../../../servicio/upload.service';
import { Alerts } from '../../../../_common/utils/alerts';

@Component({
  selector: 'ngx-admin-repository-policies',
  templateUrl: './admin-repository-policies.component.html',
  styleUrls: ['./admin-repository-policies.component.scss']
})
export class AdminRepositoryPoliciesComponent implements OnInit {

  constructor(private uploadService:UploadService) { }

  politicas: RepositorioDocumentoDto[];

  url: string;

  popupVisible: boolean = false;
  popupVisible2: boolean = false;

  disableButton: boolean = true;

  // duracionImagenForm = this.fb.group({
  //   duracion: [0, Validators.required]
  // });

  duracionImagenForm: UntypedFormControl = new UntypedFormControl(0, Validators.required)


  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  abrirPopup2 = (repositorioId:number) => { this.popupVisible2 = true; this.repositoryIdSeleccionado=repositorioId };
  cerrarPopup2 = () => { this.popupVisible2 = false };

  ngOnInit(): void {

    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Politicas).then((data) => {
      this.politicas = data;
      console.log(data);
      
    });
  }

  fileUploaderControl: any;
  iniciarFileUploader(event: { component: any; }) {
    this.fileUploaderControl = event.component;
    // this.isDisabled=true;
  }

  files_to_upload: File[] = [];
  AgregarArchivos(data): void {
    this.files_to_upload = new Array<File>();
    data.value.forEach(item => {
      this.files_to_upload.push(item);
    })
  }


  async guardarArchivos() {
    Alerts.openLoad('Actualizando políticas...');
    await this.uploadService.subirDocumentoV2(TipoRepositorioEnum.Politicas, this.files_to_upload,1)
    this.fileUploaderControl.reset();    
    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Politicas).then(data => {
      Alerts.success('¡Exito!', 'El proceso se ejecutó correctamente');
        this.politicas=data;
    })
    
  }

  async ver(data) {
    this.url = await data.data.fullPath;
    await this.abrirPopup();

  }

  confirmar() {
    Alerts.openLoad();
    this.politicas = []
    this.uploadService.eliminarDocumento(TipoRepositorioEnum.Politicas, this.repositoryIdSeleccionado).then(data => {
      this.politicas = data;
      this.cerrarPopup2();
      Alerts.closeLoad();
    })
  }

  repositoryIdSeleccionado: number;
  
  delete(data) {
    // this.repositoryIdSeleccionado = data.id;
    this.abrirPopup2(data.id);

  }

}
