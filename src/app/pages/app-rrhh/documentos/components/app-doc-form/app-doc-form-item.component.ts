import { Component } from '@angular/core';

@Component({
  selector: 'doc-form-item',
  template: `<ng-content></ng-content>`,
  styles: [
    `
    :host {
        width: auto !important;
        flex: 1 1 auto !important;
        padding: 5px 20px 5px 0px !important;
    }
    `
  ]
})
export class DocFormItemComponent { }
