import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { PlazaDto } from "../../../../model/gestiones-varias/plaza-dto";
import { GestionesVariasService } from "../../../../servicio/gestiones-varias.service";
import { Alerts } from "../../../../_common/utils/alerts";

@Component({
  selector: "ngx-plazas-vacantes-postulantes",
  templateUrl: "./plazas-vacantes-postulantes.component.html",
  styleUrls: ["./plazas-vacantes-postulantes.component.scss"],
})
export class PlazasVacantesPostulantesComponent implements OnInit {
  requisitos: string;

  isDisable: boolean = true;
  popupVisible: boolean = false;
  abrirPopup = () => {
    this.popupVisible = true;
  };
  cerrarPopup = () => {
    this.popupVisible = false;
  };

  popupVisible2: boolean = false;
  abrirPopup2 = () => {
    this.popupVisible2 = true;
  };
  cerrarPopup2 = () => {
    this.popupVisible2 = false;
  };

  phonePattern: any = /^[02-9]\d{9}$/;
  phoneRules: any = {
    X: /[02-9]/,
  };

  plazaForm = new UntypedFormGroup({
    nombre: new UntypedFormControl('', Validators.required),
    correo: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
  ),
    telefono: new UntypedFormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    es_recomendado: new UntypedFormControl(false, Validators.required)
  });


  // plazaForm = this.fb.group({
  //   nombre: [""],
  //   correo: ["", Validators.required],
  //   telefono: ["", Validators.required],
  //   es_recomendado: [false, Validators.required],
  // });

  constructor(
    private fb: UntypedFormBuilder,
    private gestionesVariasService: GestionesVariasService
  ) {}
  plazas: PlazaDto[];

  ngOnInit(): void {
    this.plazas = [];

    this.gestionesVariasService.obtenerPlazas().then((data) => {
      this.plazas = data;
    });
  }

  fileUploaderControl: any;
  iniciarFileUploader(event: { component: any }) {
    this.fileUploaderControl = event.component;
    // this.isDisabled=true;
  }

  files_to_upload: File[] = [];
  AgregarArchivos(data): void {
    this.files_to_upload = new Array<File>();
    data.value.forEach((item) => {
      this.files_to_upload.push(item);
    });
  }

  plazaId: number;
  aplicar(data) {
    const value = JSON.parse(localStorage.getItem("Auth"));
    // this.plazaForm.patchValue({nombre:value.name})

    this.plazaForm.get('es_recomendado').setValue(false);
    this.plazaForm.get('nombre').setValue(value.name);
    this.abrirPopup();

    this.plazaId = data.id;
  }

  cancelar() {
   
   
    this.cerrarPopup();

    //   this.plazaForm.reset({
    //   nombre: new FormControl("", Validators.required),
    //   correo: new FormControl("", Validators.required),
    //   telefono: new FormControl("", Validators.required),
    //   es_recomendado: new FormControl(false, Validators.required),
    // });

  }

  async cambioValor(e) {
    
    const value = JSON.parse(localStorage.getItem("Auth"));
    this.plazaForm.patchValue({nombre:value.name})

    if (e.value === true) {
      this.isDisable = false;
      this.plazaForm.patchValue({nombre:''})
    } else {
      this.plazaForm.patchValue({nombre:value.name})
      this.isDisable = true;
    }
    
  }

  // guardarPostulante() {
  //   const value = JSON.parse(localStorage.getItem("Auth")); // string | null

  //   let postulante = {
  //     id: 0,
  //     empleadoId: value.empleadoId,
  //     nombre: this.plazaForm.value.nombre,
  //     correo: this.plazaForm.value.correo,
  //     telefono: this.plazaForm.value.telefono,
  //     esRecomendado: this.plazaForm.value.es_recomendado,
  //     plazaVacanteId: this.plazaId,
  //   };

  //   this.gestionesVariasService
  //     .guardarPostulante(postulante, this.files_to_upload)
  //     .then((data) => {
  //       console.log(data);
        
  //       this.cerrarPopup();
  //       Alerts.success("Exito", "Se ha guardado el registro");
        
  //       this.plazaForm.reset;
  //       this.fileUploaderControl.reset();
  //     }).catch(()=>{
        
  //       this.cerrarPopup();
  //     });
  // }


  guardarPostulante() {
    const value = JSON.parse(localStorage.getItem("Auth")); // string | null

    let postulante = {
      id: 0,
      empleadoId: value.empleadoId,
      nombre: this.plazaForm.value.nombre,
      correo: this.plazaForm.value.correo,
      telefono: this.plazaForm.value.telefono,
      esRecomendado: this.plazaForm.value.es_recomendado,
      plazaVacanteId: this.plazaId,
    };

    this.gestionesVariasService
      .guardarPostulante(postulante)
      .then((data) => {
        this.cerrarPopup();
        Alerts.success("Exito", "Se ha guardado el registro");
        
        this.plazaForm.reset;
        // this.fileUploaderControl.reset();
      }).catch(()=>{
        
        this.cerrarPopup();
      });
  }

  getRequisitos(data) {
    this.requisitos = data.requisitos;
    this.abrirPopup2();
  }

  guardarArchivos() {
    // console.log(this.files_to_upload);
  }
}
