import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

import * as Survey from 'survey-angular';
import { Data } from '../../../../model/encuesta/data';
import { EncuestaAnswerDto } from '../../../../model/encuesta/encuesta-answer-dto';
import { EncuestaResponseDto } from '../../../../model/encuesta/encuesta-response-dto';
import { EncuestaResponseOptionDto } from '../../../../model/encuesta/encuesta-response-option-dto';
import { EncuestaService } from '../../../../servicio/encuesta.service';
import { Alerts } from '../../../../_common/utils/alerts';

@Component({
  selector: 'ngx-encuesta-view',
  templateUrl: './encuesta-view.component.html',
  styleUrls: ['./encuesta-view.component.scss']
})
export class EncuestaViewComponent implements OnInit {

  encuestaDto:EncuestaResponseDto;
  encuestaCompleta:EncuestaAnswerDto[];
  encuestaId:number;

  constructor(private encuestaService: EncuestaService, private route: Router,private activeRoute: ActivatedRoute,) { }

  ngOnInit(): void {

    this.activeRoute.queryParams.subscribe(param => {
        
      this.encuestaId = +param.id;
    });




    this.encuestaService.GetEncuesta(this.encuestaId).then((data)=>{
      this.encuestaDto = data;

      var encuestaView = new Survey.Model(this.encuestaDto);

      encuestaView.showProgressBar = 'both';
      encuestaView.showTimerPanel = 'top';
      encuestaView.completedHtml = '<h2>Encuesta completada ¡Gracias por tu tiempo!</h2>';
      encuestaView.locale = 'es';

      encuestaView.onComplete.add(survey => {
        var header = document.querySelector('.sv_header__text');
        header.remove();


        const arrayOptions: EncuestaResponseOptionDto[][] = this.encuestaDto.pages[0].elements.map(
          q => q.choicesWithId
        );

        const respuestasCerradas: Array<Data> = this.filterByNotContain(survey.data, '_', '#');

        const answers = new Array<EncuestaAnswerDto>();

        respuestasCerradas.forEach(rc => {
          let option: EncuestaResponseOptionDto = this.filterByProperty(
            arrayOptions,
            'name',
            rc.name
          )[0];

            
          const answer = new EncuestaAnswerDto();
          answer.preguntaId = rc.id;
          answer.opcionId = option.id;
          answer.encuestaId=this.encuestaId;
          // answer.userId = userId;
          answers.push(answer);
        });

        

        // const answers= survey.data

      this.encuestaCompleta=answers;


        this.encuestaService.GuardarEncuesta(this.encuestaCompleta).then((resultado) => {
          if (resultado == true) {
           
            setTimeout(() => {
              this.route.navigate(['home'])
            }, 3000);
          }
          else {
            Alerts.error("Error", "Algo ha salido mal");
          }

        });

      });


      Survey.SurveyNG.render('surveyContainer', { model: encuestaView });


    });
  }

  filterByContain(array, value) {
    var filtered = [];
    for (var key in array) {
      if (typeof (key == 'object')) {
        if (key.includes(value)) {
          filtered.push({
            id: +(key.replace('_', '').replace('#', '')),
            name: array[key]
          });
        }
      }
    }

    return filtered;
  }

  filterByNotContain(array, value, value2) {
    var filtered = [];
    for (var key in array) {
      if (typeof (key == 'object')) {
        if (!key.includes(value) && !key.includes(value2)) {
          filtered.push({
            id: +key,
            name: array[key]
          });
        }
      }
    }

    return filtered;
  }


  filterByProperty(array, prop, value) {
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];

      for (var key in obj) {
        if (typeof (obj[key] == 'object')) {
          var item = obj[key];
          if (item[prop] == value) {
            filtered.push(item);
          }
        }
      }
    }

    return filtered;
  }

}
