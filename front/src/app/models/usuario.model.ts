export interface Usuario {
  id?: string;
  login: string;
  nome: string;
  vitoriasJogador: number;
  vitoriasBot: number;
  partidasJogadas: number;
  historico: string[];
}
