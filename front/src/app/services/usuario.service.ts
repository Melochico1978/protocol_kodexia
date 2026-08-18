import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3001/usuarios';
  private usuarioLogado: Usuario | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('usuarioLogado');
      if (stored) {
        this.usuarioLogado = JSON.parse(stored);
      }
    }
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogado;
  }

  setUsuarioLogado(usuario: Usuario): void {
    this.usuarioLogado = usuario;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }
  }

  loginOuCadastrar(login: string, nome: string): Observable<Usuario> {
    const loginFormatado = login.toLowerCase().trim();
    return this.http.get<Usuario[]>(`${this.apiUrl}?login=${loginFormatado}`).pipe(
      switchMap(usuarios => {
        if (usuarios && usuarios.length > 0) {
          const u = usuarios[0];
          this.setUsuarioLogado(u);
          return of(u);
        } else {
          // Criar novo usuário
          const novoUsuario: Usuario = {
            login: loginFormatado,
            nome: nome.trim(),
            vitoriasJogador: 0,
            vitoriasBot: 0,
            partidasJogadas: 0,
            historico: []
          };
          return this.http.post<Usuario>(this.apiUrl, novoUsuario).pipe(
            tap(criado => this.setUsuarioLogado(criado))
          );
        }
      })
    );
  }

  registrarPartida(vitoriaJogador: boolean): Observable<Usuario | null> {
    if (!this.usuarioLogado || !this.usuarioLogado.id) return of(null);

    const usr = { ...this.usuarioLogado };
    usr.partidasJogadas = (usr.partidasJogadas || 0) + 1;
    
    if (!usr.historico) usr.historico = [];

    if (vitoriaJogador) {
      usr.vitoriasJogador = (usr.vitoriasJogador || 0) + 1;
      usr.historico.push('VITORIA');
    } else {
      usr.vitoriasBot = (usr.vitoriasBot || 0) + 1;
      usr.historico.push('DERROTA');
    }

    return this.http.put<Usuario>(`${this.apiUrl}/${usr.id}`, usr).pipe(
      tap(atualizado => this.setUsuarioLogado(atualizado))
    );
  }
}
