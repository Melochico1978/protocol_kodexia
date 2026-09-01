export interface Carta {
  id?: string;
  grupo: string;
  codigo: string;
  nome: string;
  performance: number;
  sintaxe: number;
  seguranca: number;
  longevidade: number;
  popularidade: number;
  abstracao: number;
  versatilidade: number;
  lendaria: boolean;
  selecionada?: boolean;
}