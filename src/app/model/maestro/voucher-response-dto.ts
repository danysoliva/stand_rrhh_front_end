import { VoucherDto } from "./voucher-dto";
import { VoucherHorasExtasDto } from "./voucher-horas-extras-dto";

export class VoucherResponseDto {
    payRolTypeId: number=0;
    voucher: VoucherDto = new VoucherDto();
    voucherHorasExtas: VoucherHorasExtasDto = new VoucherHorasExtasDto();
}