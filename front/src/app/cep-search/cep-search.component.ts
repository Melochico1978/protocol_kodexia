import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cep-search',
  imports: [CommonModule],
  templateUrl: './cep-search.component.html',
  styleUrl: './cep-search.component.css'
})
export class CepSearchComponent {
  http = inject(HttpClient);
  endereco: any = null;

  buscarCep(cep: string) {
    this.http.get(`http://viacep.com.br/ws/${cep}/json`)
    .subscribe(dados => {this.endereco = dados;
      console.log(dados);
    });
  }
}
