import { Component , inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cep-search',
  imports: [CommonModule],
  templateUrl: './cep-search.html',
  styleUrl: './cep-search.css',
})
export class CepSearch {
  http = inject(HttpClient);
  endereco: any= null;

  buscarCep(cep:string){
    this.http.get(`http://viacep.com.br/ws/${cep}/json`)
    .subscribe(dados => this.endereco = dados);
  }
}
