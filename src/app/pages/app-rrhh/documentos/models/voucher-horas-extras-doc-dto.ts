export class VoucherHorasExtrasDocDto {
    payslipName: string;
    state: string;
    employeeId: number;
    employeeName: string;
    employeeDepartment: string;
    employeeJobName: string;
    identificacion: string;
    employeeJournal: string;
    barCode: string;
    fechaPago: string;
    moneda:string;
    dateStart: string;
    dateEnd: string;
    totalHorasExtras:number;
    totalCantidadHoras:number;
    detalles: DetalleHoras[];
}

export class DetalleHoras {
    code: string;
    detalle: string;
    cantidadHoras: number;
    totalLinea: number;
}