import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CredencialUsuarioDto } from '../model/login/credencial-usuario-dto';
import { RepositorioImagenesDto } from '../model/maestro/repositorio-imagenes-dto';
import { UploadService } from '../servicio/upload.service';
import { AuthService } from '../_auth/auth.service';
import SwiperCore, { EffectFlip, Pagination, Navigation, Autoplay, EffectFade, SwiperOptions, Swiper } from "swiper";
import { Alerts } from '../_common/utils/alerts';
import { environment } from '../../environments/environment';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  url:string;
  swiper: Swiper;
  credencialUsuario: CredencialUsuarioDto;
  constructor(public authService: AuthService, private fb: UntypedFormBuilder, private uploadService: UploadService) {
    this.credencialUsuario = new CredencialUsuarioDto;
  }

  formCredencial: UntypedFormGroup = this.fb.group({
    barcode: ['', Validators.required],
    pin: ['', Validators.required]
  });

  noticias: RepositorioImagenesDto[];
  duracionImagenes: number;

  ngOnInit(): void {
    localStorage.clear();
    this.authService.logout();

    
    this.uploadService.obtenerImagenesNoticias().then((data) => {
      SwiperCore.use([Autoplay, Pagination, Navigation, EffectFade]);
      this.noticias = data.repositorioImagenes;
      this.duracionImagenes = data.duracionImagenes;
      // console.log(this.duracionImagenes);


      this.swiper = new Swiper(".swiper-container", {
        //centeredSlides: true,
        // spaceBetween: 30,
        effect: "fade",
        autoHeight: true,
        autoplay: {
          delay: this.duracionImagenes,
          // disableOnInteraction: false,
        },
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        //   draggable: true,
        // },
      });

      this.swiper.autoplay.start();
    });

    setTimeout(() => {
      document.getElementById("swiper").style.width = "70.1%";
      document.getElementById("form").style.width = "29.9%";
    }, 400);

    
   this.url= environment.host+"#/auth/quejas-sugerencias-denuncias";
  }

  login() {    
    localStorage.clear();
    this.credencialUsuario = this.formCredencial.getRawValue();
    this.authService.login(this.credencialUsuario);
  }
}
