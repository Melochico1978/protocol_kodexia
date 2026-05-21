import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../models/carta.model';

@Component({
  selector: 'app-carta-exibicao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carta-exibicao.component.html',
  styleUrl: './carta-exibicao.component.css'
})
export class CartaExibicaoComponent {
  @Input({ required: true }) carta!: Carta;

  // Função para calcular a largura da barrinha (0 a 100%)
  getBarWidth(nota: number): string {
    return (nota * 10) + '%';
  }
}