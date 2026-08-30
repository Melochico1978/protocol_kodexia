import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ranking-sandbox',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingSandboxComponent implements OnInit {
  
  // API do nosso Sandbox Controller
  private apiUrl = 'http://localhost:8080/sandbox/usuarios/ranking';
  
  jogadores: any[] = [];
  carregando: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarRanking();
  }

  carregarRanking() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        // Pega apenas o Top 10
        this.jogadores = dados.slice(0, 10);
        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao carregar ranking", err);
        this.carregando = false;
      }
    });
  }
}
