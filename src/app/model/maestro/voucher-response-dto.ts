import { VoucherDto } from "./voucher-dto";
import { VoucherHorasExtasDto } from "./voucher-horas-extras-dto";

export class VoucherResponseDto {
    payRolTypeId: number;
    voucher: VoucherDto;
    voucherHorasExtas: VoucherHorasExtasDto;
}