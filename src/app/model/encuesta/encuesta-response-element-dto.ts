import { EncuestaResponseOptionDto } from "./encuesta-response-option-dto";



export class EncuestaReponseElementDto {
    type: string;
    name: string;
    title: string;
    isRequired: boolean;
    choices: string[];
    choicesWithId: EncuestaResponseOptionDto[];
    colCount: number;
}