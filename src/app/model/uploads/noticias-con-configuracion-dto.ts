import { RepositorioImagenesDto } from "../maestro/repositorio-imagenes-dto";

export interface NoticiasConConfiguracionDto {
    duracionImagenes: number;
    repositorioImagenes: RepositorioImagenesDto[];
}