import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carta } from '../models/carta.model';

@Injectable({
  providedIn: 'root'
})
export class CartaService {
  private apiUrl = 'http://localhost:3000/cartas';
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

  setDeck(cartas: Carta[]): void {
    this.deckSelecionado = cartas;
  }

  getDeck(): Carta[] {
    return this.deckSelecionado;
  }
}