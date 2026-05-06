export class VoucherDecimoTercerMesResponseDto {
    id: number=0;
    payslipName: string='';
    payslipRunName: string='';
    state: string='';
    employeeId: number=0;
    barCode: string='';
    employeeName: string='';
    employeeDepartment: string='';
    employeeJobName: string='';
    employeeJournal: string='';
    identificacion: string='';
    dateStart: string='';
    dateEnd: string='';
    fechaPago: string='';
    moneda: string='';
    detalle: DecimoTercerMesDetalleResponseDto[]=[];
}

 export class DecimoTercerMesDetalleResponseDto {
     
    concepto: string='';
    codigo: string='';
    valor: number=0;
    orden: number=0;
    cantidad: number=0;
}