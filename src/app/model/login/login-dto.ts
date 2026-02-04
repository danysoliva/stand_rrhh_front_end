import { Injectable } from "@angular/core";


@Injectable()
export class LoginDto /*extends RespuestaLoginDto*/{
    public empleadoId:number;
    public name:string;
    public hasStaffInCharge:boolean;
    public barcode:string;
    public userLevelId:number;
    public token:string;
}