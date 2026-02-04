import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocFormComponent } from './app-doc-form.component';
import { DocFormItemComponent } from './app-doc-form-item.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    declarations: [
        DocFormComponent,
        DocFormItemComponent
    ],
    exports: [
        DocFormComponent,
        DocFormItemComponent
    ],
    providers: [
    ]
})

export class AppDocFormsModule { }
