import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRRHHComponent } from './app-rrhh.component';
import { AdminNoticiasComponent } from './configuracion/admin-noticias/admin-noticias.component';
import { DeduccionPlanillaComponent } from './solicitudes/gestiones-varias/deduccion-planilla/deduccion-planilla.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { QuejasSugerenciasDenunciasComponent } from './quejas-sugerencias-denuncias/quejas-sugerencias-denuncias.component';
import { ListadoConstanciasComponent } from './solicitudes/listado-constancias/listado-constancias.component';
import { ListadoVacacionesComponent } from './solicitudes/listado-vacaciones/listado-vacaciones.component';
import { SolicitarConstanciaComponent } from './solicitudes/solicitar-constancia/solicitar-constancia.component';
import { SolicitarVacacionComponent } from './solicitudes/solicitar-vacacion/solicitar-vacacion.component';
import { DelegacionUsuariosComponent } from './configuracion/delegacion-usuarios/delegacion-usuarios.component';
import { PlazasVacantesComponent } from './reclutamiento-seleccion/plazas-vacantes/plazas-vacantes.component';
import { PlazasVacantesPostulantesComponent } from './reclutamiento-seleccion/plazas-vacantes-postulantes/plazas-vacantes-postulantes.component';
import { EncuestaAdminComponent } from './encuesta/encuesta-admin/encuesta-admin.component';
import { EncuestaCreatorComponent } from './encuesta/encuesta-creator/encuesta-creator.component';
import { EncuestaViewComponent } from './encuesta/encuesta-view/encuesta-view.component';
import { EncuestasHabilitadasComponent } from './encuesta/encuestas-habilitadas/encuestas-habilitadas.component';
import { QuejasSugerenciasDenunciasAdminComponent } from './quejas-sugerencias-denuncias-admin/quejas-sugerencias-denuncias-admin.component';
import { EncuestasTabulacionComponent } from './encuesta/encuestas-tabulacion/encuestas-tabulacion.component';
import { AdminRepositoryDocumentsComponent } from './configuracion/admin-repository-documents/admin-repository-documents.component';
import { RepositoryDocumentsComponent } from './configuracion/repository-documents/repository-documents.component';
import { AdminRepositoryPoliciesComponent } from './configuracion/admin-repository-policies/admin-repository-policies.component';
import { RepositoryPoliciesComponent } from './configuracion/repository-policies/repository-policies.component';
import { AdminGrupoFormatosComponent } from './configuracion/admin-grupo-formatos/admin-grupo-formatos.component';

const routes: Routes = [
  {
    path: '',
    component: AppRRHHComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'quejas-sugerencias-denuncias',
        component: QuejasSugerenciasDenunciasComponent,
      },
      {
        path: 'quejas-sugerencias-denuncias-admin',
        component: QuejasSugerenciasDenunciasAdminComponent,
      },
      {
        path: 'solicitudes/solicitar_constancia',
        component: SolicitarConstanciaComponent,
      },
      {
        path: 'solicitudes/solicitar_vacacion',
        component: SolicitarVacacionComponent,
      },
      {
        path: 'solicitudes/constancias_solicitadas',
        component: ListadoConstanciasComponent,
      },
      {
        path: 'solicitudes/vacaciones_solicitadas',
        component: ListadoVacacionesComponent,
      },
      {
        path: 'solicitudes/deduccion_planilla',
        component: DeduccionPlanillaComponent,
      },
      {
        path: 'configuracion/admin-noticias',
        component: AdminNoticiasComponent,
      },
      {
        path: 'configuracion/roles-usuarios',
        component: DelegacionUsuariosComponent,
      },
      {
        path: 'reclutamiento-y-seleccion/plazas-vacantes',
        component: PlazasVacantesComponent,
      },
      {
        path: 'reclutamiento-y-seleccion/plazas-vacantes-postulantes',
        component: PlazasVacantesPostulantesComponent,
      },
      {
        path: 'encuesta/encuesta-admin',
        component: EncuestaAdminComponent,
      },
      {
        path: 'encuesta/encuesta-creator',
        component: EncuestaCreatorComponent,
      },
      {
        path: 'encuesta/encuesta-view',
        component: EncuestaViewComponent,
      },
      {
        path: 'encuesta/encuestas-habiitadas',
        component: EncuestasHabilitadasComponent,
      },
      {
        path: 'encuesta/encuestas-tabulacion',
        component: EncuestasTabulacionComponent,
      },
      {
        path: 'configuracion/admin-repositorio-formatos',
        component: AdminRepositoryDocumentsComponent,
      },
      {
        path: 'configuracion/repositorio-formatos',
        component: RepositoryDocumentsComponent,
      },
      {
        path: 'configuracion/admin-repositorio-politicas',
        component: AdminRepositoryPoliciesComponent,
      },
      {
        path: 'configuracion/repositorio-politicas',
        component: RepositoryPoliciesComponent,
      },
      {
        path: 'configuracion/admin-grupos-formatos',
        component: AdminGrupoFormatosComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRRHHRoutingModule {
}

