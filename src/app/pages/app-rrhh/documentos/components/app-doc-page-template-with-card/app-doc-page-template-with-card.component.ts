import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doc-page-template-with-card',
  templateUrl: './app-doc-page-template-with-card.component.html',
  styleUrls: ['./app-doc-page-template-with-card.component.scss']
})
export class AppDocPageTemplateWithCardComponent {
  @Input() icon = 'assignment_turned_in';
  @Input() title = 'Titulo de la pantalla';
}
