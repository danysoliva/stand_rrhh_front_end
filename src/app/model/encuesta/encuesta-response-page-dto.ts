import { EncuestaReponseElementDto } from "./encuesta-response-element-dto";

export interface EncuestaResponsePageDto {
    title: string;
    description: string;
    elements: EncuestaReponseElementDto[];
}