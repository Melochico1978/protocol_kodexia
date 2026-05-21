import { AtributoCarta } from "./atributo-carta.interface";
import { CodigoCartaEnum } from "./codigo-carta.enum";

export interface CartaTrunfo {
  codigo: CodigoCartaEnum;
  nome: string;
  imagemUrl: string;
  atributos: AtributoCarta[];
  isSuperTrunfo: boolean;
  mensagemSuperTrunfo?: string;
}