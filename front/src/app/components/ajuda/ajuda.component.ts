import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.css'] // Corrigido para plural para evitar erros de compilação
})
export class AjudaComponent {
  secaoAtiva: string = 'tutorial'; 

  constructor(private location: Location) {}

  alterarSecao(novaSecao: string): void {
    this.secaoAtiva = novaSecao;
  }

  voltar(): void {
    this.location.back();
  }

  alertaSistema(): void {
    alert('SISTEMA OFFLINE: Setor de rede ainda não descriptografado pelo Arquiteto.');
  }
}