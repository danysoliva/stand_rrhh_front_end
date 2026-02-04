import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

import { MENU_ADMIN, MENU_ITEMS, MENU_JEFE, MENU_USER } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['pages.component.scss'],
})
export class PagesComponent implements OnInit {

  menu: NbMenuItem[];

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('Auth'));
    let menu = [];

    if(usuario.userLevelId == 1){
      MENU_ADMIN.forEach(item => {
        item.hidden = false;
      })
  
      menu = MENU_ADMIN
    }else if(usuario.hasStaffInCharge == true){
      MENU_JEFE.forEach(item => {
        item.hidden = false;
      })
  
      menu = MENU_JEFE
    }
    else if(usuario.userLevelId == 2){
      MENU_USER.forEach(item => {
        item.hidden = false;
      })
  
      menu = MENU_USER
    }

    

    // if (usuario.tipoUsuarioId == 2) {
    //   MENU_ITEMS.forEach(item => {
    //     if (item.title == 'Configuración')
    //       item.hidden = true;

    //     if (item.title == 'Tickets')
    //       item.hidden = true;
    //   })
    // }
    // else {
    //   MENU_ITEMS.forEach(item => {
    //     if (item.title == 'Ticket')
    //       item.hidden = true;
    //   })
    // }

    this.menu = menu;
  }
}


