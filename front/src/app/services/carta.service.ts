import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carta } from '../models/carta.model';

@Injectable({
  providedIn: 'root'
})
export class CartaService {
  private apiUrl = '/api/cartas';
  private deckSelecionado: Carta[] = [];

  constructor(private http: HttpClient) { }

  getCartas(): Observable<Carta[]> {
    return this.http.get<Carta[]>(this.apiUrl);
  }

  addCarta(carta: Carta): Observable<Carta> {
    return this.http.post<Carta>(this.apiUrl, carta);
  }

  deleteCarta(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCarta(id: string, carta: Partial<Carta>): Observable<Carta> {
    return this.http.patch<Carta>(`${this.apiUrl}/${id}`, carta);
  }

  setDeck(cartas: Carta[]): void {
    this.deckSelecionado = cartas;
  }

  getDeck(): Carta[] {
    return this.deckSelecionado;
  }

  getPartidaPvp(): Observable<any> {
    return this.http.get<any>('/api/partida_pvp');
  }

  savePartidaPvp(state: any): Observable<any> {
    return this.http.put<any>('/api/partida_pvp', { ...state, id: "1" });
  }
}