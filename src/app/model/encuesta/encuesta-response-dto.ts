import { EncuestaResponsePageDto } from "./encuesta-response-page-dto";

export interface EncuestaResponseDto {
    iD: number;
    title: string;
    description: string;
    startSurveyText: string;
    pages: EncuestaResponsePageDto[];
}