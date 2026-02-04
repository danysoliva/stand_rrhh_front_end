import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RepositorioImagenesDto } from '../../../../model/maestro/repositorio-imagenes-dto';
import { NoticiasConConfiguracionDto } from '../../../../model/uploads/noticias-con-configuracion-dto';
import { UploadService } from '../../../../servicio/upload.service';
import { Alerts } from '../../../../_common/utils/alerts';

@Component({
  selector: 'ngx-admin-noticias',
  templateUrl: './admin-noticias.component.html',
  styleUrls: ['./admin-noticias.component.scss']
})
export class AdminNoticiasComponent implements OnInit {

  constructor(private uploadService: UploadService) { }

  noticiasConConfiguracion: NoticiasConConfiguracionDto;

  duracionImagenes: number;
  duracionImagenesInicial: number;
  noticias: RepositorioImagenesDto[];
  // tmpNoticias: RepositorioImagenesDto[];

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

  abrirPopup2 = () => { this.popupVisible2 = true };
  cerrarPopup2 = () => { this.popupVisible2 = false };

  ngOnInit(): void {

    this.uploadService.obtenerImagenesNoticias().then((data) => {

      this.noticias = data.repositorioImagenes;
      this.duracionImagenes = data.duracionImagenes / 1000;
      this.duracionImagenesInicial = data.duracionImagenes / 1000;
    });

    // this.disableButton=false;
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
    Alerts.openLoad('Actualizando imágenes...');
    await this.uploadService.subirArchivos(this.files_to_upload)
    this.fileUploaderControl.reset();    
    this.noticias = [];
    this.uploadService.obtenerImagenesNoticias().then(data => {
      this.noticias = data.repositorioImagenes
      Alerts.success('¡Exito!', 'El proceso se ejecutó correctamente');
    })
  }

  async ver(data: any) {
     
    this.url = await data.data.fullPath;
    await this.abrirPopup();
      
  }

  cancelar() {
    this.cerrarPopup2();
  }

  confirmar() {
    Alerts.openLoad();
    this.noticias = []
    this.uploadService.eliminarImagen(this.repositoryId).then(data => {
      this.noticias = data;
      this.cerrarPopup2();
      Alerts.closeLoad();
    })
  }

  repositoryId: number;
  delete(data) {
    this.repositoryId = data.id;
    this.abrirPopup2();

  }

  getValue(data) {

    if (data != this.duracionImagenesInicial) {
      this.disableButton = false;
    }
    else {
      this.duracionImagenes = data
    }

  }


  saveDuracionImagenes() {
    Alerts.openLoad();
    this.uploadService.cambiarDuracionImagen(this.duracionImagenForm.value)
      .then(() => {
        Alerts.success('¡Exito!', 'Se ha cambiado la configuración');
      })

  }

}
