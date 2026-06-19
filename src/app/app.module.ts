/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import {
  NbButtonModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";
import { DxButtonModule, DxNumberBoxModule, DxRadioGroupModule, DxTextBoxModule } from "devextreme-angular";
import { DxoLabelModule } from "devextreme-angular/ui/nested";
import { UsuarioService } from "./servicio/usuario.service";
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { AuthService } from "./_auth/auth.service";
import { ReactiveFormsModule } from "@angular/forms";
import { UploadService } from "./servicio/upload.service";
import { MaestroService } from "./servicio/maestro.service";
import { AuthInterceptor } from "./_auth/auth.interceptor";
import { SolicitudService } from "./servicio/solicitud.service";
import { ErrorInterceptor } from "./_common/interceptors/error-interceptor";
import { GestionesVariasService } from "./servicio/gestiones-varias.service";
import { QuejasDenunciasSugerenciasService } from "./servicio/quejas-denuncias-sugerencias.service";
import { EmailService } from "./servicio/email.service";
import { EncuestaService } from "./servicio/encuesta.service";
import dxRadioGroup from "devextreme/ui/radio_group";

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DxTextBoxModule,
    DxRadioGroupModule,
    DxoLabelModule,
    ThemeModule,
    DxNumberBoxModule,
    NbButtonModule,
    DxButtonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  providers: [
    AuthService,
    UsuarioService,
    UploadService,
    MaestroService,
    SolicitudService,
    GestionesVariasService,
    QuejasDenunciasSugerenciasService,
    EmailService,
    EncuestaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
