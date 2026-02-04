import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { EncuestaDto } from "../../../../model/encuesta/encuesta-dto";
import { EncuestaSaveParamsDto } from "../../../../model/encuesta/encuesta-save-params-dto";
import { PreguntaDto } from "../../../../model/encuesta/pregunta-dto";
import { EncuestaService } from "../../../../servicio/encuesta.service";
import { Alerts } from "../../../../_common/utils/alerts";

@Component({
  selector: "ngx-encuesta-creator",
  templateUrl: "./encuesta-creator.component.html",
  styleUrls: ["./encuesta-creator.component.scss"],
})
export class EncuestaCreatorComponent implements OnInit {
  popupVisible: boolean = false;
  itemDeleteMode = "toggle";
  allowDeletion = true;

  esEditarForm: boolean;

  encuesta: EncuestaSaveParamsDto;
  preguntas: PreguntaDto[];
  idToEdit: number;

  opciones: string[];

  // preguntaForm = new FormGroup({
  titulo = new UntypedFormControl("", Validators.required);
  pregunta = new UntypedFormControl("", Validators.required);
  opcion = new UntypedFormControl("", Validators.required);
  //  opciones: new FormControl(Array, Validators.required),
  // });

  abrirPopup = () => {
    this.popupVisible = true;
  };
  cerrarPopup = () => {
    this.popupVisible = false;
  };


  preguntaValida:boolean = false;
  keyUpPregunta(e) {
    const inputValue = e.event.target.value;
    this.preguntaValida = inputValue.length > 0;    
  }

  opcionValida:boolean = false;
  keyUpOpcion(e) {
    const inputValue = e.event.target.value;
    this.opcionValida = inputValue.length > 0;    
  }

  opcionChange(){
    this.opcionValida = false;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private encuestaService: EncuestaService
  ) {}

  ngOnInit(): void {
    this.preguntas = [];
    // this.titulo.setValue('');
    this.encuesta = new EncuestaSaveParamsDto();
  }

  generar() {
    this.abrirPopup();
    this.pregunta.setValue("");
    this.opciones = [];
    this.esEditarForm = false;
  }

  confirmar() {
    if (this.esEditarForm == false) {
      let pregunta = {
        pregunta: this.pregunta.value,
        opciones: this.opciones,
        id: this.preguntas.length + 1,
      };

      this.preguntas.push(pregunta);
    } else {
      this.preguntas.find((r) => r.id == this.idToEdit).pregunta =
        this.pregunta.value;
      this.preguntas.find((r) => r.id == this.idToEdit).opciones =
        this.opciones;
    }

    this.pregunta.setValue("");
    this.opciones = [];

    this.cerrarPopup();
  }

  cancelar() {
    this.cerrarPopup();
  }

  add() {
    this.opciones.push(this.opcion.value);

    this.opcion.setValue("");
    this.opcionValida = false
  }

  editar(e) {
    this.idToEdit = 0;

    this.idToEdit = e.path[1].id.replace("crud", "");
    let preguntaEditar = this.preguntas.find((r) => r.id == this.idToEdit);

    this.pregunta.setValue(preguntaEditar.pregunta);
    this.opciones = preguntaEditar.opciones;
    this.esEditarForm = true;
    this.abrirPopup();
  }

  index: number;
  eliminar(e) {
    let id = e.path[1].id.replace("crud", "");

    this.index = this.preguntas.indexOf(this.preguntas.find((r) => r.id == id));

    this.preguntas.splice(this.index, 1);
  }

  save() {
    this.encuesta.titulo = this.titulo.value;
    this.encuesta.preguntas = this.preguntas;

    this.encuestaService.saveEncuestaCreatorborrarImagen(this.encuesta).then(()=>{
      this.encuesta= new EncuestaSaveParamsDto;
      
      this.titulo.setValue('');
      this.encuesta= new EncuestaSaveParamsDto();
      this.preguntas=[];
    
      Alerts.success('Confirmacion','Se ha guardado la encuesta')
    });
  }
}
