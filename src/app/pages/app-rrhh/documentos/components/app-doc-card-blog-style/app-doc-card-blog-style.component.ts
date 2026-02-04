import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Alertas } from '../../../app/core/helpers/notificaciones';

@Component({
  selector: 'app-doc-card-blog-style',
  templateUrl: './app-doc-card-blog-style.component.html',
  styleUrls: ['./app-doc-card-blog-style.component.scss']
})
export class AppDocCardBlogStyleComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() title: string;
  @Input() subtitle: string;
  @Input() Description: string;
  @Input() id: number;
  @Input() imageUri: string;
  @Input() navigateToUri: string;

  styleTo = ``;
  
  ngOnInit() {
    this.styleTo = `background-image: url(${this.imageUri})`
  }

  navigateTo(){
    // this.router.navigate([this.navigateToUri], {queryParams: {id: this.id}});
    // // Alertas.image(this.title, this.Description, this.imageUri);
    // Alertas.withImage(this.title, this.Description, this.imageUri);
  }

}
