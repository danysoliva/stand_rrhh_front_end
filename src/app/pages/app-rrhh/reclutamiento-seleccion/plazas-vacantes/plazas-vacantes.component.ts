import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentDto } from '../../../../model/gestiones-varias/department-dto';
import { PlazaDto } from '../../../../model/gestiones-varias/plaza-dto';
import { PostulantesAdminDto } from '../../../../model/gestiones-varias/postulantes-admin-dto';
import { GestionesVariasService } from '../../../../servicio/gestiones-varias.service';
import { MaestroService } from '../../../../servicio/maestro.service';
import { Alerts } from '../../../../_common/utils/alerts';

@Component({
  selector: 'ngx-plazas-vacantes',
  templateUrl: './plazas-vacantes.component.html',
  styleUrls: ['./plazas-vacantes.component.scss']
})
export class PlazasVacantesComponent implements OnInit {

  constructor(private fb:UntypedFormBuilder,private gestionesVariasService:GestionesVariasService) { }
  
  isMultiline = true;
  popupVisible: boolean = false;
  abrirPopup = () => { this.popupVisible = true };
  cerrarPopup = () => { this.popupVisible = false };
  requisitos: string;


  popupVisible2: boolean = false;
  abrirPopup2 = () => { this.popupVisible2 = true };
  cerrarPopup2= () => { this.popupVisible2 = false };

  popupVisible3: boolean = false;
  abrirPopup3 = () => { this.popupVisible3 = true };
  cerrarPopup3= () => { this.popupVisible3 = false };

  popupVisible4: boolean = false;
  abrirPopup4 = () => { this.popupVisible4 = true };
  cerrarPopup4= () => { this.popupVisible4 = false };

  departamentos:DepartmentDto[];
  searchTimeoutOption = 200;
  searchModeOption = 'contains';
  searchExprOption: any = 'descripcion';

  plazas:PlazaDto[];

  postulantesAdmin:PostulantesAdminDto[];

  plazaForm = this.fb.group({
    department_id: [0, Validators.required],
    requisitos: ["", Validators.required],
    titulo: ["", Validators.required],
  });
  
    ngOnInit(): void {
      this.plazas=[];
      
      this.gestionesVariasService.obtenerDepartamentos().then(data=>{
        this.departamentos=data;
        // console.log(data);
        
      })

      this.gestionesVariasService.obtenerPlazas().then(data=>{
        this.plazas=data;       
      })
    }


    cancelar(){
      this.cerrarPopup();
    }

   
    guardarPlaza(){
      this.plazas=[]

      let plaza = {
        id:0,
        departmentId:this.plazaForm.value.department_id,
        titulo:this.plazaForm.value.titulo,
        requisitos:this.plazaForm.value.requisitos,
        departamento:"",
        fechaCreacion:""

      }
      this.gestionesVariasService.guardarPlaza(plaza).then(data=>{
          this.plazas = data;

          Swal.fire(
            '',
            'Se han guardado los datos exitosamente!',
            'success'
          )

         this.plazaForm.reset;

      }).catch((ex)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ex.error.message,
        })
      });

      this.cerrarPopup();

    }
    
    nuevaPlaza(){
      this.abrirPopup();      

    }

    getRequisitos(data){
      this.requisitos=data.requisitos;
      this.abrirPopup2();
    }

    plazaId:number;
    delete(data){
      this.abrirPopup3();
      
      this.plazaId=data.id;
    }

    confirmar(){
      this.cerrarPopup3();

      this.gestionesVariasService.eliminarPlaza(this.plazaId).then(data=>{
        this.plazas=[];
        this.plazas=data;

        Swal.fire(
          'Good job!',
          'Se ha eliminado el registro!',
          'success'
        )

      }).catch(ex=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ex.error.message,
        })
      })
    }

    cancelar2(){
      this.cerrarPopup3();
    }

    titulo:string;
    postulantes(data){
      this.abrirPopup4();

      this.titulo=data.titulo;
      this.gestionesVariasService.getPostulantesByPlazaId(data.id).then((datos)=>{
        
       this.postulantesAdmin = datos;
       
      }).catch(()=>{
        Alerts.error("Error", "Ha ocurrido un error");
      })
    }

    descartar(data){
      let postulanteId: string;
      postulanteId = data.srcElement.id.replace('postu','');

     this.gestionesVariasService.descartarPostulante(parseInt(postulanteId)).then((data)=>{
          // this.postulantesAdmin=[];
          // this.postulantesAdmin=data;

          var element = document.getElementById("profile"+postulanteId);
    element.parentNode.removeChild(element);
             })
      
        
    }
}
