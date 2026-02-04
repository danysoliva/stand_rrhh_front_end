import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doc-popup',
  templateUrl: './app-doc-popup.component.html',
  styleUrls: ['./app-doc-popup.component.scss']
})
export class AppDocPopupComponent {
  isVisible = false;
  isMinimized = false;
  position = 'center';
  title = '';
  @Input() isFullScreen = false;
  @Input() customMinWidth = '695px';
  @Input() customWidth = '800px';
  @Input() customMinHeight = '600px';
  @Input() customHeight = '763px';
  @Input() customMaxHeight = '600px';
  @Input() enableMinimizeButton = true;
  @Input() enableResizeButton = true;
  @Input() enableExitButton = true;
  @Input() dragEnabled = true;

  minimizePopup() {
    this.isMinimized = true;
    this.isVisible = false;
  }

  closePopup() {
    this.isMinimized = false;
    this.isVisible = false;
  }

  show(title: string) {
    this.title = title;
    this.isVisible = true;
  }
}
