import { VoucherBeneficioPlanillaDto } from "./voucher-beneficio-planilla-dto";
import { VoucherBeneficiosDto } from "./voucher-beneficios-dto";
import { VoucherDeduccionPlanillaDto } from "./voucher-deduccion-planilla-dto";
import { VoucherDeduccionesDto } from "./voucher-deducciones-dto";

export interface VoucherDto {
    id: number;
    payslipName: string;
    payslipRunName: string;
    state: string;
    employeeId: number;
    barCode: string;
    employeeName: string;
    employeeDepartment: string;
    employeeJobName: string;
    employeeJournal: string;
    dateStart: string;
    dateEnd: string;
    fechaPago: string;
    moneda: string;
    ahorroRetiroCooperativa: number;
    ahorroFijoCooperativa: number;
    bancos: number;
    cafeteria: number;
    ihss: number;
    afp: number;
    incapacidades: number;
    isr: number;
    diasVacaciones: number;
    diasLaborados: number;
    diasFaltados: number;
    salarioBase: number;
    vacaciones: number;
    bono: number;
    totalEgresos: number;
    salarioNeto: number;
    totalIngresos: number;
    deducciones: VoucherDeduccionPlanillaDto[];
    beneficios:VoucherBeneficioPlanillaDto[];
}

