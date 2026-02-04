export class ConstanciaTrabajoDocDto {
    tipoConstanciaId: number;
    moneda: string;
    employee: string;
    identificationId: string;
    department: string;
    job: string;
    fechaIngreso: string;
    deducciones: Array<ConstanciaTrabajoIngresoDeduccionDto>;
    ingresos: Array<ConstanciaTrabajoIngresoDeduccionDto>;
    totalDeducciones: number;
    totalIngresos: number;
    ingresosNetos: number;
    createdDate: string;

    diaIngreso:number;
    mesIngreso:string;
    anioIngreso:number;
    diaActual:number;
    mesActual:string;
    anioActual:number;


}

export class ConstanciaTrabajoIngresoDeduccionDto {
    id: number;
    nombre: string;
    monto: number;
}