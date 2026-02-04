import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doc-section',
  templateUrl: './app-doc-section.component.html',
  styleUrls: ['./app-doc-section.component.scss']
})
export class AppDocSectionComponent {
  @Input() sectionName = 'Fs Section';
  sectionIsHidden = false;

  showOrHideSectionContent() 
  {
    this.sectionIsHidden = this.sectionIsHidden ? false : true;
  }
}
