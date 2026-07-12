import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../models/carta.model'; 
import { CartaTrunfo } from './shared/carta.interface'; 

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartaComponent implements OnInit, OnChanges {
  
  @Input() cartaInput!: Carta;

  
  carta!: CartaTrunfo;

  ngOnInit() {
    this.atualizarDesign();
  }

  ngOnChanges() {
    this.atualizarDesign();
  }

  atualizarDesign() {
    if (this.cartaInput) {
      this.carta = {
        codigo: (this.cartaInput.grupo + '-' + this.cartaInput.codigo) as any,
        nome: this.cartaInput.nome.toUpperCase(),
        imagemUrl: 'assets/images/placeholder.png',  
        isSuperTrunfo: this.cartaInput.lendaria,
        mensagemSuperTrunfo: 'VENCE DE TODOS (EXCETO GRUPO A)',
        atributos: [
          { nome: 'PERFORMANCE', valor: this.cartaInput.performance },
          { nome: 'SINTAXE', valor: this.cartaInput.sintaxe },
          { nome: 'SEGURANÇA', valor: this.cartaInput.seguranca },
          { nome: 'LONGEVIDADE', valor: this.cartaInput.longevidade },
          { nome: 'POPULARIDADE', valor: this.cartaInput.popularidade },
          { nome: 'ABSTRAÇÃO', valor: this.cartaInput.abstracao },
          { nome: 'VERSATILIDADE', valor: this.cartaInput.versatilidade }
        ]
      };
    }
  }
}