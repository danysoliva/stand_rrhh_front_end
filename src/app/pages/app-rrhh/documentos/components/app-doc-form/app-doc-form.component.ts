import { Component } from '@angular/core';

@Component({
  selector: 'doc-form',
  template: `<ng-content></ng-content>`,
  styles: [
    `
    :host {
      width: auto !important;
      height: auto !important;
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: flex-end !important;
      justify-content: space-between !important;
      padding: 20px !important;
    }
    `
  ]
})
export class DocFormComponent { }
