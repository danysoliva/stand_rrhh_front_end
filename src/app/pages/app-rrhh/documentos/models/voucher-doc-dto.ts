import { VoucherBeneficioPlanillaDto } from "../../../../model/maestro/voucher-beneficio-planilla-dto";
import { VoucherDeduccionPlanillaDto } from "../../../../model/maestro/voucher-deduccion-planilla-dto";

export class VoucherDocDto {
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
    dateStart: string='';
    dateEnd: string='';
    fechaPago: string='';
    moneda:string='';
    ahorroRetiroCooperativa: number=0;
    ahorroFijoCooperativa: number=0;
    bancos: number=0;
    cafeteria: number=0;
    ihss: number=0;
    afp: number=0;
    incapacidades: number=0;
    isr: number=0;
    diasVacaciones: number=0;
    diasLaborados: number=0;
    diasFaltados: number=0;
    salarioBase: number=0;
    vacaciones: number=0;
    bono: number=0;
    totalEgresos: number=0;
    salarioNeto: number=0;
    totalIngresos: number=0;
    deducciones:VoucherDeduccionPlanillaDto[]=[];
    beneficios:VoucherBeneficioPlanillaDto[]=[];
}

