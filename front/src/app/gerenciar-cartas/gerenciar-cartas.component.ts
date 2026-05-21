import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { CartaService } from '../services/carta.service';
import { Carta } from '../models/carta.model';
import { CartaComponent } from '../components/carta/carta.component';

@Component({
  selector: 'app-gerenciar-cartas',
  standalone: true,
  imports: [CommonModule, FormsModule, CartaComponent, RouterModule], 
  templateUrl: './gerenciar-cartas.component.html',
  styleUrl: './gerenciar-cartas.component.css'
})
export class GerenciarCartasComponent implements OnInit {
  cartas: Carta[] = [];
  
  novaCarta: Carta = {
    nome: '',
    grupo: 'A',
    codigo: '',
    performance: 0,
    sintaxe: 0,
    seguranca: 0,
    longevidade: 0,
    popularidade: 0,
    abstracao: 0,
    versatilidade: 0,
    lendaria: false
  };

  constructor(private cartaService: CartaService) {}

  ngOnInit(): void {
    this.carregarCartas();
  }

  carregarCartas(): void {
    this.cartaService.getCartas().subscribe((data: Carta[]) => {
      // Já não precisamos adicionar a propriedade falsa 'selecionada' aqui
      this.cartas = data;
    });
  }

  adicionarCarta(): void {
    this.novaCarta.codigo = Math.floor(1 + Math.random() * 9).toString();
    
    this.cartaService.addCarta(this.novaCarta).subscribe(() => {
      this.carregarCartas();
      this.novaCarta = {
        nome: '', grupo: 'A', codigo: '', performance: 0, sintaxe: 0, seguranca: 0,
        longevidade: 0, popularidade: 0, abstracao: 0, versatilidade: 0, lendaria: false
      };
    });
  }

  excluirCarta(id: string | undefined): void {
    if (id) {
      this.cartaService.deleteCarta(id).subscribe(() => {
        this.carregarCartas();
      });
    }
  }
}