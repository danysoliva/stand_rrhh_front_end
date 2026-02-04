import { NgModule } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbMenuModule, NbUserModule, NbWindowModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DxPopupModule } from 'devextreme-angular';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbWindowModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    DxPopupModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
  ],
})
export class PagesModule {
}
