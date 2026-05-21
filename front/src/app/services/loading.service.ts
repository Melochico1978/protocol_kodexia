// src/app/services/loading.service.ts
import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingItems: string[] = []; // Lista de coisas que estão sendo carregadas
  isLoading = signal<boolean>(false); // Sinal para o estado de exibição

  constructor() {}

  adicionarItemLoading(item: string): void {
    if (this.loadingItems.indexOf(item) === -1) {
      this.loadingItems.push(item);
    }
    this.checkLoadingStatus();
  }

  removerItemLoading(item: string): void {
    const index = this.loadingItems.indexOf(item);
    if (index !== -1) {
      this.loadingItems.splice(index, 1);
    }
    this.checkLoadingStatus();
  }

  pararLoading(): void {
    this.loadingItems = [];
    this.isLoading.set(false);
  }

  private checkLoadingStatus(): void {
    this.isLoading.set(this.loadingItems.length > 0);
  }
}