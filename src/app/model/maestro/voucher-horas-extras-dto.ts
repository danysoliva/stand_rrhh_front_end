export class VoucherHorasExtasDto {
    payslipName: string="";
    state: string="";
    employeeId: number=0;
    employeeName: string="";
    employeeDepartment: string="";
    employeeJobName: string="";
    identificacion: string="";
    employeeJournal: string="";
    barCode: string="";
    fechaPago: string="";
    moneda:string="";
    dateStart: string="";
    dateEnd: string="";
    totalHorasExtras:number=0;
    totalCantidadHoras:number=0;
    detalles: DetalleHoras[]=[];
}

export class DetalleHoras {
    code: string="";
    concepto: string="";
    cantidadHoras: number=0;
    totalLinea: number=0;
}