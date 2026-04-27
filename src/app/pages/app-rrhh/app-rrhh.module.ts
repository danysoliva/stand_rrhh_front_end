import { NgModule } from "@angular/core";
import { NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbUserModule, NbWindowModule } from "@nebular/theme";
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxFileUploaderModule, DxGalleryModule, DxHtmlEditorModule, DxListModule, DxLookupModule, DxNumberBoxModule, DxPivotGridModule, DxPopupModule, DxRadioGroupModule, DxScrollViewModule, DxSelectBoxModule, DxSwitchModule, DxTextAreaModule, DxTextBoxModule, DxValidatorModule } from "devextreme-angular";
import { ThemeModule } from "../../@theme/theme.module";
import { AppRRHHRoutingModule } from "./app-rrhh-routing.module";
import { FormsModule, FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from "ngx-print";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { AppRRHHComponent } from "./app-rrhh.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { UploadService } from "../../servicio/upload.service";
import { QuejasSugerenciasDenunciasComponent } from './quejas-sugerencias-denuncias/quejas-sugerencias-denuncias.component';
import { AdminNoticiasComponent } from './configuracion/admin-noticias/admin-noticias.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DocumentosModule } from "./documentos/documentos.module";
import { SolicitarConstanciaComponent } from './solicitudes/solicitar-constancia/solicitar-constancia.component';
import { SolicitarVacacionComponent } from './solicitudes/solicitar-vacacion/solicitar-vacacion.component';
import { ListadoConstanciasComponent } from './solicitudes/listado-constancias/listado-constancias.component';
import { ListadoVacacionesComponent } from './solicitudes/listado-vacaciones/listado-vacaciones.component';
import { SolicitudService } from "../../servicio/solicitud.service";
import { MaestroService } from "../../servicio/maestro.service";
// import { SwiperModule } from "swiper/angular";
import { DeduccionPlanillaComponent } from './solicitudes/gestiones-varias/deduccion-planilla/deduccion-planilla.component';
import { GestionesVariasService } from "../../servicio/gestiones-varias.service";
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { DelegacionUsuariosComponent } from './configuracion/delegacion-usuarios/delegacion-usuarios.component';
import { CustomDatePipe } from "../../_common/pipes/custom.datepipe.pipe";
import { PlazasVacantesComponent } from './reclutamiento-seleccion/plazas-vacantes/plazas-vacantes.component';
import { PlazasVacantesPostulantesComponent } from './reclutamiento-seleccion/plazas-vacantes-postulantes/plazas-vacantes-postulantes.component';
import { QuejasSugerenciasDenunciasAdminComponent } from "./quejas-sugerencias-denuncias-admin/quejas-sugerencias-denuncias-admin.component";
import { EncuestasHabilitadasComponent } from "./encuesta/encuestas-habilitadas/encuestas-habilitadas.component";
import { EncuestaAdminComponent } from "./encuesta/encuesta-admin/encuesta-admin.component";
import { EncuestaCreatorComponent } from "./encuesta/encuesta-creator/encuesta-creator.component";
import { EmailService } from "../../servicio/email.service";
import { EncuestaService } from "../../servicio/encuesta.service";
import { EncuestasTabulacionComponent } from './encuesta/encuestas-tabulacion/encuestas-tabulacion.component';
import dxPivotGrid from "devextreme/ui/pivot_grid";
import { QuejasSugerenciasDenunciasLoginComponent } from './quejas-sugerencias-denuncias-login/quejas-sugerencias-denuncias-login.component';
import { AdminRepositoryDocumentsComponent } from './configuracion/admin-repository-documents/admin-repository-documents.component';
import { RepositoryDocumentsComponent } from './configuracion/repository-documents/repository-documents.component';
import { AdminRepositoryPoliciesComponent } from "./configuracion/admin-repository-policies/admin-repository-policies.component";
import { RepositoryPoliciesComponent } from "./configuracion/repository-policies/repository-policies.component";
import { AdminGrupoFormatosComponent } from './configuracion/admin-grupo-formatos/admin-grupo-formatos.component';
import { DocVacacionNewFormatPdfComponent } from "./documentos/components/doc-vacacion-new-format-pdf/doc-vacacion-new-format-pdf.component";
import { DocDeduccionPlanillaNewFormatPdfComponent } from "./documentos/components/doc-deduccion-planilla-new-format-pdf/doc-deduccion-planilla-new-format-pdf.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
      ThemeModule,
      NbInputModule,
      NbCardModule,
      NbButtonModule,
      NbActionsModule,
      NbUserModule,
      NbCheckboxModule,
      DxSwitchModule,
      NbRadioModule,
      NbDatepickerModule,
      AppRRHHRoutingModule,
      NbSelectModule,
      NbIconModule,
      ngFormsModule,
      DxDataGridModule,
      DxTextBoxModule,
      DxTextAreaModule,
      DxDateBoxModule,
      DxDateBoxModule,
      DxScrollViewModule,
      DxPopupModule,
      DxNumberBoxModule,
      DxLookupModule,
      DxValidatorModule,
      DxFileUploaderModule,
      DxSelectBoxModule,
      DxGalleryModule,
      DxPivotGridModule, 
      DxButtonModule,
      DxCheckBoxModule,
      DxRadioGroupModule,
      DxListModule,
      FormsModule,
      ReactiveFormsModule,
      DxHtmlEditorModule,
      NbWindowModule,
      NgxPrintModule,
      PDFExportModule,
      HttpClientModule,
      RouterModule,
      DocumentosModule,
      // SwiperModule,
      NgxUsefulSwiperModule,
      CommonModule
    ],
    declarations: [
      AppRRHHComponent,
      HomeComponent,
      PerfilComponent,
      QuejasSugerenciasDenunciasComponent,
      AdminNoticiasComponent,
      CustomDatePipe,
      SolicitarConstanciaComponent,
      SolicitarVacacionComponent,
      ListadoConstanciasComponent,
      ListadoVacacionesComponent,
      DeduccionPlanillaComponent,
      DelegacionUsuariosComponent,
      PlazasVacantesComponent,
      PlazasVacantesPostulantesComponent,
      QuejasSugerenciasDenunciasComponent,
      QuejasSugerenciasDenunciasAdminComponent,
      EncuestasHabilitadasComponent,
      EncuestaAdminComponent,
      EncuestaCreatorComponent,
      EncuestasTabulacionComponent,
      QuejasSugerenciasDenunciasLoginComponent,
      AdminRepositoryDocumentsComponent,
      RepositoryDocumentsComponent,
      AdminRepositoryPoliciesComponent,
      RepositoryPoliciesComponent,
      AdminGrupoFormatosComponent,
      DocVacacionNewFormatPdfComponent,
      DocDeduccionPlanillaNewFormatPdfComponent,
    ],
    providers:[]
  })
  export class AppRRHHModule { }