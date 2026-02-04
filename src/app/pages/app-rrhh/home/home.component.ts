import { Component, OnInit } from '@angular/core';
import { NoticiaDto } from '../../../model/uploads/noticia-dto';
import { UploadService } from '../../../servicio/upload.service';
declare var $: any;
import SwiperCore, { EffectFlip, Pagination, Navigation, Autoplay, EffectFade, SwiperOptions, Swiper } from "swiper";
import { RepositorioImagenesDto } from '../../../model/maestro/repositorio-imagenes-dto';
import { NoticiasConConfiguracionDto } from '../../../model/uploads/noticias-con-configuracion-dto';

@Component({
  selector: "ngx-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private uploadService: UploadService) { }

  // noticiasConConfiguracion: NoticiasConConfiguracionDto;

  noticias: RepositorioImagenesDto[];
  duracionImagenes: number;

  ngOnInit(): void {
    SwiperCore.use([Autoplay, Pagination, Navigation, EffectFade]);

    this.uploadService.obtenerImagenesNoticias().then((data) => {
      this.noticias = data.repositorioImagenes;
      this.duracionImagenes = data.duracionImagenes;
      // console.log(this.duracionImagenes);

      var swiper = new Swiper(".mySwiper", {
        centeredSlides: true,
        spaceBetween: 30,
        effect: "fade",
        autoHeight: true,
        autoplay: {
          delay: this.duracionImagenes,
          disableOnInteraction: false,
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
      });
      swiper.autoplay.start();
    });
  }

}
