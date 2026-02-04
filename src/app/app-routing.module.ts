import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { QuejasSugerenciasDenunciasComponent } from './pages/app-rrhh/quejas-sugerencias-denuncias/quejas-sugerencias-denuncias.component';
import { QuejasSugerenciasDenunciasLoginComponent } from './pages/app-rrhh/quejas-sugerencias-denuncias-login/quejas-sugerencias-denuncias-login.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'quejas-sugerencias-denuncias',
        component: QuejasSugerenciasDenunciasLoginComponent,
      },
      // {
      //   path: 'register',
      //   component: NbRegisterComponent,
      // },
      // {
      //   path: 'logout',
      //   component: NbLogoutComponent,
      // },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // },
    ],
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  // { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
