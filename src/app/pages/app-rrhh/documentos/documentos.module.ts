import { NgModule } from '@angular/core';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { DxFileUploaderModule, DxNumberBoxModule, DxScrollViewModule, DxSelectBoxModule, DxDataGridModule, DxTabsModule, DxCheckBoxModule, DxTextBoxModule, DxPopupModule, DxSwitchModule, DxDropDownBoxModule, DxListModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppDocBaseComponent } from './components/app-doc-base/app-doc-base.component';
import { AppDocCardBlogStyleComponent } from './components/app-doc-card-blog-style/app-doc-card-blog-style.component';
import { AppDocFormsModule } from './components/app-doc-form/app-doc-forms.module';
import { AppDocPageTemplateDefaultComponent } from './components/app-doc-page-template-default/app-doc-page-template-default.component';
import { AppDocPageTemplateWithCardComponent } from './components/app-doc-page-template-with-card/app-doc-page-template-with-card.component';
import { AppDocPopupComponent } from './components/app-doc-popup/app-doc-popup.component';
import { AppDocSectionComponent } from './components/app-doc-section/app-doc-section.component';
import { AppPrintDocumentPreviewComponent } from './components/app-print-document-preview/app-print-document-preview.component';

import { DocConstanciaTrabajoComponent } from './components/doc-constancia-trabajo/doc-constancia-trabajo.component';
import { DocDeduccionPlanillaComponent } from './components/doc-deduccion-planilla/doc-deduccion-planilla.component';
import { DocVacacionComponent } from './components/doc-vacacion/doc-vacacion.component';
import { DocVoucherComponent } from './components/doc-voucher/doc-voucher.component';
import { DocVoucherHorasExtrasComponent } from './components/doc-voucher-horas-extras/doc-voucher-horas-extras.component';
import { DocDetalleHorasTrabajadasComponent } from './components/doc-detalle-horas-trabajadas/doc-detalle-horas-trabajadas.component';
import { DocVacacionNewFormatComponent } from './components/doc-vacacion-new-format/doc-vacacion-new-format.component';
import { DocDeduccionPlanillaNewFormatComponent } from './components/doc-deduccion-planilla-new-format/doc-deduccion-planilla-new-format.component';
import { DocVoucherNewComponent } from './components/doc-voucher-new/doc-voucher-new.component';
import { DocVoucherDecimoTercerMesComponent } from './components/doc-voucher-decimo-tercer-mes/doc-voucher-decimo-tercer-mes.component';




@NgModule({
  imports: [
    RouterModule, 
    AppDocFormsModule,
    DxPopupModule,
    CommonModule,
    PDFExportModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    ReactiveFormsModule,
    DxFileUploaderModule,
    DxDataGridModule,
    DxTabsModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxPopupModule,
    DxSwitchModule,
    DxDropDownBoxModule,
    DxListModule,
  ],
  providers: [
  ],
  declarations: [
    AppDocBaseComponent,
    AppDocCardBlogStyleComponent,
    AppDocPageTemplateDefaultComponent,
    AppDocPageTemplateWithCardComponent,
    AppDocPopupComponent,
    AppDocSectionComponent,
    AppPrintDocumentPreviewComponent,
    DocConstanciaTrabajoComponent,
    DocDeduccionPlanillaComponent,
    DocDeduccionPlanillaNewFormatComponent,
    DocVoucherComponent,
    DocVoucherHorasExtrasComponent,
    DocVacacionComponent,
    DocVacacionNewFormatComponent,
    DocVoucherNewComponent,
    DocVoucherDecimoTercerMesComponent,
    DocDetalleHorasTrabajadasComponent
    // DocumentComponent,
  ],
  exports: [
    AppDocBaseComponent,
    AppDocCardBlogStyleComponent,
    AppDocPageTemplateDefaultComponent,
    AppDocPageTemplateWithCardComponent,
    AppDocPopupComponent,
    AppDocSectionComponent,
    AppPrintDocumentPreviewComponent,

    DocConstanciaTrabajoComponent,
    DocDeduccionPlanillaComponent,
    DocDeduccionPlanillaNewFormatComponent,
    DocVoucherComponent,
    DocVoucherHorasExtrasComponent,
    DocVacacionComponent,
    DocVacacionNewFormatComponent,
    DocVoucherNewComponent,
    DocVoucherDecimoTercerMesComponent,
    DocDetalleHorasTrabajadasComponent
    // DocumentComponent,
  ]
})
export class DocumentosModule {}
