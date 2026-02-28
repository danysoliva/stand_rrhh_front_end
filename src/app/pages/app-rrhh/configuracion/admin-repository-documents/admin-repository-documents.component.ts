import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RepositorioDocumentoDto, TipoRepositorioEnum } from '../../../../model/uploads/repositorio-documento-dto';
import { UploadService } from '../../../../servicio/upload.service';
import { Alerts } from '../../../../_common/utils/alerts';
import { RepositoryGroupDto } from '../../../../model/uploads/repository-group-dto';

@Component({
  selector: 'ngx-admin-repository-documents',
  templateUrl: './admin-repository-documents.component.html',
  styleUrls: ['./admin-repository-documents.component.scss']
})
export class AdminRepositoryDocumentsComponent implements OnInit {

  constructor(private uploadService:UploadService) { }

  formatos: RepositorioDocumentoDto[];

  url: string;
  grupos: RepositoryGroupDto[];
  gruposFiltrados: RepositoryGroupDto[];

  seleccionGrupo: number=0;
  seleccionGrupoNombre: string='';


  popupVisible: boolean = false;
  popupVisible2: boolean = false;
  popupVisibleGrupo: boolean = false;
  popupVisibleAdminGrupo: boolean = false;

  disableButton: boolean = true;

  duracionImagenForm: UntypedFormControl = new UntypedFormControl(0, Validators.required)


  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  abrirPopup2 = (repositorioId:number) => { this.popupVisible2 = true; this.repositoryIdSeleccionado=repositorioId };
  cerrarPopup2 = () => { this.popupVisible2 = false };

  abrirPopupGrupo = (repositorioId:number) => { this.popupVisibleGrupo = true; };
  cerrarPopupGrupo = () => { this.popupVisibleGrupo = false };

  abrirPopupAdminGrupo = () => { this.popupVisibleAdminGrupo = true; };
  cerrarPopupAdminGrupo = () => { this.popupVisibleAdminGrupo = false };

  ngOnInit(): void {

    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Formatos).then((data) => {
      this.formatos = data;
      // console.log(data);
      
    });
    
    this.cargarGrupos();

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
    Alerts.openLoad('Actualizando formatos...');
    // await this.uploadService.subirDocumento(TipoRepositorioEnum.Formatos, this.files_to_upload)
    await this.uploadService.subirDocumentoV2(TipoRepositorioEnum.Formatos, this.files_to_upload,this.seleccionGrupo)
    this.fileUploaderControl.reset();    
    this.uploadService.obtenerDocumentos(TipoRepositorioEnum.Formatos).then(data => {
      Alerts.success('¡Exito!', 'El proceso se ejecutó correctamente');
        this.formatos=data;
    })
    
  }

  async ver(data) {
    this.url = await data.data.fullPath;
    await this.abrirPopup();

  }

  confirmar() {
    Alerts.openLoad();
    this.formatos = []
    this.uploadService.eliminarDocumento(TipoRepositorioEnum.Formatos, this.repositoryIdSeleccionado).then(data => {
      this.formatos = data;
      this.cerrarPopup2();
      Alerts.closeLoad();
    })
  }

  repositoryIdSeleccionado: number;

  delete(data) {
    this.abrirPopup2(data.id);
  }

  cambiarGrupo(data) {
    this.abrirPopupGrupo(data.id);    
    this.repositoryIdSeleccionado = data.id;

    this.gruposFiltrados = this.grupos.filter(d=> d.id!=data.grupoId);

  }

  valorSeleccionado(evento){
    this.seleccionGrupo=evento.value;

    this.seleccionGrupoNombre = this.grupos.find(f=> f.id === this.seleccionGrupo).descripcion;

    // console.log(this.seleccionGrupo);
    
  }

  GuardarCambioGrupo(){
       // console.log(this.formatos.find(d=> d.id ===this.repositoryIdSeleccionado));
      this.uploadService.CambiarGrupoDocumento(this.repositoryIdSeleccionado,this.seleccionGrupo).then((data)=>{
          this.formatos = data;
      });
      
      this.cerrarPopupGrupo();
  }

 async onSaveGrupo(e){
  await this.cargarGrupos(); 
    this.cerrarPopupAdminGrupo(); 
  }

 async cargarGrupos(){
   this.grupos = await this.uploadService.obtenerDocumentosGrupo();

  }

}
