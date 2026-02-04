import { Component, OnInit } from '@angular/core';
import { Route, Router,ActivatedRoute } from '@angular/router';
import { EncuestaDto } from '../../../../model/encuesta/encuesta-dto';
import { EncuestaService } from '../../../../servicio/encuesta.service';
import { Alerts } from '../../../../_common/utils/alerts';

@Component({
  selector: 'ngx-encuestas-habilitadas',
  templateUrl: './encuestas-habilitadas.component.html',
  styleUrls: ['./encuestas-habilitadas.component.scss']
})
export class EncuestasHabilitadasComponent implements OnInit {

  constructor(private encuestaService:EncuestaService,private route:Router) { }

encuestas:EncuestaDto[];
isVisible:boolean;

popupVisible: boolean = false;
  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };

  ngOnInit(): void {
    this.encuestaService.ObtenerEncuestasActivas().then(data=>{

      var values = JSON.parse(localStorage.getItem("Auth"));
      
      if (values.userLevelId==1) {
        this.isVisible=true;
      }
      else
      this.isVisible=false;


      this.encuestas=data;
    })
  }


  llenarEncuesta(e){    
    this.route.navigate(['/pages/encuesta/encuesta-view'],{ queryParams: { id: e.data.id }}).then((data)=>{
      
    }).catch((ex)=>{

      // console.log(ex.error);
      Alerts.error('Error',ex.message.error)
      this.route.navigate(['/pages/encuesta/encuestas-habiitadas']);
    })

    
  }

  encuestaId:number;
  cerrarEncuesta(e){
    this.encuestaId=e.data.id
      this.abrirPopup();
  }
  
  
 async confirmar(){
    this.encuestaService.CerarEncuesta(this.encuestaId).then(()=>{
  
     this.encuestas= [];

      this.encuestaService.ObtenerEncuestasActivas().then((data)=>{

          this.encuestas=data

      });

      Alerts.success('Confirmacion','Se ha cerrado la encuesta')
    })

    this.cerrarPopup();
// console.log(this.encuestaId);


  }

    cancelar(){
        this.cerrarPopup();
    }
    

}
